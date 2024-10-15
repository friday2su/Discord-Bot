const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Displays a user\'s warnings.')
    .addUserOption(option => option.setName('user').setDescription('User to check').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const userRecord = await User.findOne({ userId: user.id });

    if (!userRecord || userRecord.warnings.length === 0) {
      return interaction.reply(`⚠️ | **${user.tag}** has no warnings.`);
    }

    const warningsList = userRecord.warnings.map(warning => `Reason: ${warning.reason}, Date: ${warning.date.toLocaleString()}`).join('\n');
    return interaction.reply(`⚠️ | **${user.tag}** has the following warnings:\n${warningsList}`);
  }
};
