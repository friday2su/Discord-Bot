const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');
const config = require('../../config');
const checkCooldown = require('../../helpers/checkCooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Collect your daily cash reward.'),
  async execute(interaction) {
    let user = await User.findOne({ userId: interaction.user.id });
    if (!user) {
      user = new User({
        userId: interaction.user.id,
        cash: 0,
        bank: 0,
        lastDaily: null,
      });
    }

    // Cooldown check
    const cooldown = checkCooldown(user.lastDaily, config.cooldowns.daily);
    if (cooldown.remaining) {
      return interaction.reply({ content: `🕒 | You can collect your daily cash in **${cooldown.time}**!`, ephemeral: true });
    }

    // Randomize the daily cash reward between 50 and 150
    const randomCash = Math.floor(Math.random() * 101) + 50;
    user.cash += randomCash;
    user.lastDaily = Date.now();
    await user.save();

    await interaction.reply(`🎉 | You collected your daily reward of **${randomCash} cash**!`);
  }
};
