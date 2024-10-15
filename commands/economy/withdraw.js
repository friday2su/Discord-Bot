const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Withdraw your cash from the bank.')
    .addIntegerOption(option => option.setName('amount').setDescription('Amount to withdraw').setRequired(true)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const user = await User.findOne({ userId: interaction.user.id });

    if (!user || user.bank < amount) {
      return interaction.reply({ content: 'You do not have enough in your bank to withdraw.', ephemeral: true });
    }

    user.bank -= amount;
    user.cash += amount;
    await user.save();

    await interaction.reply(`🏦 | You have withdrawn **${amount} cash** from the bank.`);
  }
};
