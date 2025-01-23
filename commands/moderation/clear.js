const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Xóa toàn Bộ Tin Nhắn Khỏi Kênh🗑️.')
    .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to delete').setRequired(true)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply({ content: 'You do not have permission to clear messages.', ephemeral: true });
    }

    await interaction.channel.bulkDelete(amount, true);
    return interaction.reply(`🧹 | Cleared **${amount}** messages.`);
  }
};
