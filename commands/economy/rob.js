const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');
const config = require('../../config');
const checkCooldown = require('../../helpers/checkCooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Cố gắng cướp người dùng khác.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Chọn Thằng Để Trộm')
        .setRequired(true)
    ),
  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    if (targetUser.id === interaction.user.id) {
      return interaction.reply({ content: `❌ | Trộm chính mày ăn cặc!`, ephemeral: true });
    }

    let user = await User.findOne({ userId: interaction.user.id });
    let target = await User.findOne({ userId: targetUser.id });

    if (!user || !target) {
      return interaction.reply({ content: `❌ | Mày Hoặc nó đéo có tài khoản!`, ephemeral: true });
    }

    // Cooldown check
    const cooldown = checkCooldown(user.lastRob, config.cooldowns.rob);
    if (cooldown.remaining) {
      return interaction.reply({ content: `🕒 | Tí Nữa Cho Trộm **${cooldown.time}**!`, ephemeral: true });
    }

    // Randomize the success chance
    const success = Math.random() < 0.5; // 50% chance of success
    const robAmount = Math.floor(Math.random() * 201) + 50; // Between 50 and 250

    if (success) {
      // Successful rob
      if (target.cash < robAmount) {
        return interaction.reply({ content: `❌ | Lồn cụ nghèo vc nên cút!`, ephemeral: true });
      }
      user.cash += robAmount;
      target.cash -= robAmount;
      user.lastRob = Date.now();
      await user.save();
      await target.save();

      await interaction.reply(`💰 | Mày Đã Trộm thành công🥷 **${robAmount} cash** from **${targetUser.username}**!`);
    } else {
      // Failed rob, pay the target
      if (user.cash < robAmount) {
        return interaction.reply({ content: `❌ | Đéo đủ tiền đền mà cướp ngu!`, ephemeral: true });
      }
      user.cash -= robAmount;
      target.cash += robAmount;
      user.lastRob = Date.now();
      await user.save();
      await target.save();

      await interaction.reply(`❌ | Óc cặc trộm bị người ta bắt **${targetUser.username}** and paid them **${robAmount} cash** as a penalty.`);
    }
  }
};
