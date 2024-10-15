const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Suggestion = require('../../database/models/suggestion'); // Make sure this path is correct

module.exports = {
    data: new SlashCommandBuilder()
      .setName('suggest')
      .setDescription('Suggest something')
      .addStringOption(option =>
        option.setName('suggestion')
          .setDescription('Your suggestion')
          .setRequired(true)),
    
    async execute(interaction) {
      const suggestionText = interaction.options.getString('suggestion');
      const suggestionData = await Suggestion.findOne({ guildId: interaction.guild.id });
  
      if (!suggestionData) {
        return interaction.reply('Suggestion channel not set up. Use `/suggestion setup` first.');
      }
  
      const channel = await interaction.guild.channels.fetch(suggestionData.channelId);
      const embed = new EmbedBuilder()
        .setTitle('New Suggestion')
        .setDescription(suggestionText)
        .setFooter({ text: `Suggestion ID: ${Date.now()}` });
  
      // Send the suggestion message to the designated channel
      const message = await channel.send({ embeds: [embed] });
      
      // Add the suggestion to the database
      suggestionData.suggestions.push({ messageId: message.id, content: suggestionText });
      await suggestionData.save();
      
      // Acknowledge the interaction
      await interaction.reply('Your suggestion has been sent!');
    }
};
