const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Đặt chế độ chậm cho kênh❄️.')
    .addIntegerOption(option => option.setName('duration').setDescription('Duration in seconds').setRequired(true)),
  async execute(interaction) {
    const duration = interaction.options.getInteger('duration');

    if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
      return interaction.reply({ content: 'You do not have permission to set slowmode.', ephemeral: true });
    }

    await interaction.channel.setRateLimitPerUser(duration);
    return interaction.reply(`⏳ | Slowmode set to **${duration}** seconds.`);
  }
};
