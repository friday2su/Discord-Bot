const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user from the server.')
    .addStringOption(option => option.setName('userid').setDescription('User ID to unban').setRequired(true)),
  async execute(interaction) {
    const userId = interaction.options.getString('userid');
    
    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply({ content: 'You do not have permission to unban members.', ephemeral: true });
    }

    try {
      await interaction.guild.members.unban(userId);
      return interaction.reply(`✅ | Unbanned user with ID **${userId}**.`);
    } catch (error) {
      return interaction.reply({ content: 'Could not unban that user. Please check the ID.', ephemeral: true });
    }
  }
};
