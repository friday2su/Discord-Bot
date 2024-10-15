const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Makes an announcement in a specified channel.')
    .addChannelOption(option => option.setName('channel').setDescription('Channel to announce in').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('Announcement message').setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message');

    if (!interaction.member.permissions.has('SEND_MESSAGES')) {
      return interaction.reply({ content: 'You do not have permission to send messages.', ephemeral: true });
    }

    await channel.send(`📢 Announcement: ${message}`);
    return interaction.reply(`✅ | Announcement sent in **${channel.name}**.`);
  }
};
