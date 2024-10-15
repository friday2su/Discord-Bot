const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Reports a user to moderators.')
    .addUserOption(option => option.setName('user').setDescription('User to report').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the report').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    const reportChannel = interaction.guild.channels.cache.find(channel => channel.name === 'reports');
    if (!reportChannel) return interaction.reply({ content: 'Report channel does not exist.', ephemeral: true });

    await reportChannel.send(`🚨 Reported User: **${user.tag}**\nReason: ${reason}\nReported by: **${interaction.user.tag}**`);
    return interaction.reply(`✅ | Reported **${user.tag}**. Thank you for reporting.`);
  }
};
