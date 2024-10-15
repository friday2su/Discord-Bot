const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unpin')
    .setDescription('Unpins a message in the channel.')
    .addStringOption(option => option.setName('message_id').setDescription('ID of the message to unpin').setRequired(true)),
  async execute(interaction) {
    const messageId = interaction.options.getString('message_id');

    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply({ content: 'You do not have permission to unpin messages.', ephemeral: true });
    }

    const message = await interaction.channel.messages.fetch(messageId);
    if (!message) return interaction.reply({ content: 'Message not found!', ephemeral: true });

    await message.unpin();
    return interaction.reply(`📌 | Unpinned message with ID **${messageId}**.`);
  }
};
