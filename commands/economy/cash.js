const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cash')
    .setDescription('Check your cash balance.'),
  async execute(interaction) {
    const user = await User.findOne({ userId: interaction.user.id });
    if (!user) {
      return interaction.reply({ content: 'You have no balance yet.', ephemeral: true });
    }

    await interaction.reply(`💸 | **${interaction.user.username}**, you currently have **${user.cash} cash!**`);
  }
};
