const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unmutes a user in a voice channel.')
    .addUserOption(option => option.setName('user').setDescription('User to unmute').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    if (!interaction.member.permissions.has('MUTE_MEMBERS')) {
      return interaction.reply({ content: 'You do not have permission to unmute members.', ephemeral: true });
    }

    const member = await interaction.guild.members.fetch(user.id);

    if (member) {
      await member.voice.setMute(false, 'Unmuted by command.');
      return interaction.reply(`🔊 | Unmuted **${user.tag}**.`);
    } else {
      return interaction.reply({ content: 'That user is not in this server!', ephemeral: true });
    }
  }
};
