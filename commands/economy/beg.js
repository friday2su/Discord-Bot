const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');
const config = require('../../config');
const checkCooldown = require('../../helpers/checkCooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('beg')
    .setDescription('Beg for some cash.'),
  async execute(interaction) {
    let user = await User.findOne({ userId: interaction.user.id });
    if (!user) {
      user = new User({
        userId: interaction.user.id,
        cash: 0,
        bank: 0,
        lastBeg: null,
      });
    }

    // Cooldown check
    const cooldown = checkCooldown(user.lastBeg, config.cooldowns.beg);
    if (cooldown.remaining) {
      return interaction.reply({ content: `🕒 | You can beg for money again in **${cooldown.time}**!`, ephemeral: true });
    }

    // Randomize beg amount between 10 and 50
    const randomCash = Math.floor(Math.random() * 41) + 10;
    user.cash += randomCash;
    user.lastBeg = Date.now();
    await user.save();

    await interaction.reply(`🤲 | You begged and received **${randomCash} cash**!`);
  }
};
