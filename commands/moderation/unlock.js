const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlocks a channel to allow messages.')
    .addChannelOption(option => option.setName('channel').setDescription('Channel to unlock').setRequired(false)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
      return interaction.reply({ content: 'You do not have permission to unlock channels.', ephemeral: true });
    }

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SEND_MESSAGES: true });
    return interaction.reply(`🔓 | Unlocked **${channel.name}**.`);
  }
};
