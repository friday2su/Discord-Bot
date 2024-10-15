const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Colors } = require('discord.js'); // Import Colors
const Suggestion = require('../../database/models/suggestion'); // Import the Suggestion model

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestion')
    .setDescription('Suggestion commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Setup suggestion channel')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('Channel for suggestions')
            .setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('accept')
        .setDescription('Accept a suggestion')
        .addStringOption(option =>
          option.setName('message_id')
            .setDescription('Message ID of the suggestion')
            .setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('decline')
        .setDescription('Decline a suggestion')
        .addStringOption(option =>
          option.setName('message_id')
            .setDescription('Message ID of the suggestion')
            .setRequired(true))
    ),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (subcommand === 'setup') {
      const channel = interaction.options.getChannel('channel');
      let suggestionSetup = await Suggestion.findOne({ guildId });

      if (!suggestionSetup) {
        suggestionSetup = new Suggestion({
          guildId,
          channelId: channel.id,
        });
        await suggestionSetup.save();
        await interaction.reply(`Suggestion channel set to ${channel}.`);
      } else {
        suggestionSetup.channelId = channel.id;
        await suggestionSetup.save();
        await interaction.reply(`Suggestion channel updated to ${channel}.`);
      }

    } else if (subcommand === 'accept' || subcommand === 'decline') {
      const messageId = interaction.options.getString('message_id');
      const suggestionData = await Suggestion.findOne({ guildId });

      if (!suggestionData) {
        return interaction.reply('No suggestions found.');
      }

      const suggestion = suggestionData.suggestions.find(s => s.messageId === messageId);
      if (!suggestion) {
        return interaction.reply('Suggestion not found.');
      }

      suggestion.accepted = subcommand === 'accept';
      suggestion.declined = subcommand === 'decline';
      await suggestionData.save();

      const channel = await interaction.guild.channels.fetch(suggestionData.channelId);
      const message = await channel.messages.fetch(messageId);
      const embed = new EmbedBuilder(message.embeds[0]) // Create a new EmbedBuilder with existing embed data
        .setColor(subcommand === 'accept' ? Colors.Green : Colors.Red); // Use color constants
      await message.edit({ embeds: [embed] });

      await interaction.reply(`Suggestion ${subcommand === 'accept' ? 'accepted' : 'declined'}.`);
    }
  }
};
