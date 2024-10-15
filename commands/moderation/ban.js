const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user from the server.')
    .addUserOption(option => option.setName('user').setDescription('User to ban').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
    }

    const member = await interaction.guild.members.fetch(user.id);
    
    if (member) {
      await member.ban({ reason: 'User was banned by command.' });
      return interaction.reply(`🚫 | Banned **${user.tag}** from the server.`);
    } else {
      return interaction.reply({ content: 'That user is not in this server!', ephemeral: true });
    }
  }
};
