const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Gửi tiền Vào Ngân Hàng.')
    .addIntegerOption(option => option.setName('amount').setDescription('Amount to deposit').setRequired(true)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const user = await User.findOne({ userId: interaction.user.id });

    if (!user || user.cash < amount) {
      return interaction.reply({ content: 'Mày đéo đủ tiền gửi.', ephemeral: true });
    }

    user.cash -= amount;
    user.bank += amount;
    await user.save();

    await interaction.reply(`🏦 | You have deposited **${amount} cash** into the bank.`);
  }
};
