// commands/moderation/snipe.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const messageDeleteEvent = require('../../events/messageDelete');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('Shows the most recent deleted message in this channel.'),

  async execute(interaction) {
    const lastDeletedMessage = messageDeleteEvent.getLastDeletedMessage();

    if (!lastDeletedMessage) {
      return interaction.reply({ content: 'There is no deleted message to snipe.', ephemeral: true });
    }

    const snipeEmbed = new EmbedBuilder()
      .setColor('#ff0000')
      .setAuthor({ name: lastDeletedMessage.author.tag, iconURL: lastDeletedMessage.author.displayAvatarURL() })
      .setDescription(lastDeletedMessage.content || 'No content')
      .setTimestamp(lastDeletedMessage.createdAt)
      .setFooter({ text: `Message ID: ${lastDeletedMessage.id}` });

    return interaction.reply({ embeds: [snipeEmbed] });
  }
};
