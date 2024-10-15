const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issues a warning to a user.')
    .addUserOption(option => option.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the warning').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const member = await interaction.guild.members.fetch(user.id);

    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply({ content: 'You do not have permission to warn members.', ephemeral: true });
    }

    if (member) {
      const userRecord = await User.findOne({ userId: user.id });
      if (!userRecord) {
        return interaction.reply({ content: 'User not found in the database!', ephemeral: true });
      }
      userRecord.warnings.push({ reason, date: new Date() });
      await userRecord.save();
      return interaction.reply(`⚠️ | Warned **${user.tag}** for: ${reason}`);
    } else {
      return interaction.reply({ content: 'That user is not in this server!', ephemeral: true });
    }
  }
};
