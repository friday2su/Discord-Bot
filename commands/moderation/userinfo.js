const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Displays information about a user.')
    .addUserOption(option => option.setName('user').setDescription('User to get info about').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    const member = await interaction.guild.members.fetch(user.id);
    const userInfo = `**Người dùng:** ${user.tag}\n**Đã vào sever:** ${member.joinedAt.toDateString()}\n**Vai Trò:** ${member.roles.cache.map(role => role.name).join(', ') || 'None'}`;
    return interaction.reply({ content: userInfo, ephemeral: true });
  }
};
