const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');
const config = require('../../config');
const checkCooldown = require('../../helpers/checkCooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work to earn some cash.'),
  async execute(interaction) {
    let user = await User.findOne({ userId: interaction.user.id });
    if (!user) {
      user = new User({
        userId: interaction.user.id,
        cash: 0,
        bank: 0,
        lastWork: null,
      });
    }

    // Cooldown check
    const cooldown = checkCooldown(user.lastWork, config.cooldowns.work);
    if (cooldown.remaining) {
      return interaction.reply({ content: `🕒 | Nghỉ tí rồi chém sau **${cooldown.time}**!`, ephemeral: true });
    }

    // Randomize work reward between 50 and 200
    const randomCash = Math.floor(Math.random() * 151) + 50;
    user.cash += randomCash;
    user.lastWork = Date.now();
    await user.save();

    await interaction.reply(`💼 | Mày vừa chém 500 thằng bổ túc và được **${randomCash} cash**!`);
  }
};
