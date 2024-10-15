const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Makes the bot say something.')
    .addStringOption(option => option.setName('message').setDescription('Message to send').setRequired(true)),
  async execute(interaction) {
    const message = interaction.options.getString('message');

    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    await interaction.reply(message);
    return interaction.followUp({ content: `✅ | Bot said: ${message}`, ephemeral: true });
  }
};
