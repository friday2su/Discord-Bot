const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');
const config = require('../../config');
const checkCooldown = require('../../helpers/checkCooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Attempt to rob another user.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user you want to rob')
        .setRequired(true)
    ),
  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    if (targetUser.id === interaction.user.id) {
      return interaction.reply({ content: `❌ | You can't rob yourself!`, ephemeral: true });
    }

    let user = await User.findOne({ userId: interaction.user.id });
    let target = await User.findOne({ userId: targetUser.id });

    if (!user || !target) {
      return interaction.reply({ content: `❌ | Either you or the target has no account!`, ephemeral: true });
    }

    // Cooldown check
    const cooldown = checkCooldown(user.lastRob, config.cooldowns.rob);
    if (cooldown.remaining) {
      return interaction.reply({ content: `🕒 | You can rob again in **${cooldown.time}**!`, ephemeral: true });
    }

    // Randomize the success chance
    const success = Math.random() < 0.5; // 50% chance of success
    const robAmount = Math.floor(Math.random() * 201) + 50; // Between 50 and 250

    if (success) {
      // Successful rob
      if (target.cash < robAmount) {
        return interaction.reply({ content: `❌ | The target doesn't have enough cash!`, ephemeral: true });
      }
      user.cash += robAmount;
      target.cash -= robAmount;
      user.lastRob = Date.now();
      await user.save();
      await target.save();

      await interaction.reply(`💰 | You successfully robbed **${robAmount} cash** from **${targetUser.username}**!`);
    } else {
      // Failed rob, pay the target
      if (user.cash < robAmount) {
        return interaction.reply({ content: `❌ | You don't have enough cash to pay if the rob fails!`, ephemeral: true });
      }
      user.cash -= robAmount;
      target.cash += robAmount;
      user.lastRob = Date.now();
      await user.save();
      await target.save();

      await interaction.reply(`❌ | You failed to rob **${targetUser.username}** and paid them **${robAmount} cash** as a penalty.`);
    }
  }
};
