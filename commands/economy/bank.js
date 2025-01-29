const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bank')
    .setDescription('Kiểm tra số dư tiền mặt và ngân hàng .'),
  async execute(interaction) {
    const user = await User.findOne({ userId: interaction.user.id });
    if (!user) {
      return interaction.reply({ content: 'Bạn chưa có tài khoản🏦.', ephemeral: true });
    }

    await interaction.reply(`🏦 | **${interaction.user.username}**, Mày có **${user.cash} cash💵** và **${user.bank} trong ngân hàng💵💳**.`);
  }
};
