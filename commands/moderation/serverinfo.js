const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays information about the server.'),
  
  async execute(interaction) {
    const guild = interaction.guild;

    // Define readable verification levels and explicit content filter levels
    const verificationLevels = {
      0: 'None',
      1: 'Low',
      2: 'Medium',
      3: 'High',
      4: 'Very High',
    };

    const explicitContentFilterLevels = {
      0: 'Disabled',
      1: 'Members without roles',
      2: 'All members',
    };

    // Creating an embed for server information
    const serverInfoEmbed = new EmbedBuilder()
      .setColor('#0099ff') // Color of the embed
      .setTitle(`${guild.name} Server Information`)
      .setThumbnail(guild.iconURL()) // Set server icon as thumbnail
      .addFields(
        { name: 'Server Name', value: guild.name, inline: true },
        { name: 'Region', value: guild.preferredLocale, inline: true },
        { name: 'Member Count', value: `${guild.memberCount}`, inline: true },
        { name: 'Created On', value: `${guild.createdAt.toDateString()}`, inline: true },
        { name: 'Owner', value: `${guild.ownerId ? `<@${guild.ownerId}>` : 'Unknown'}`, inline: true },
        { name: 'Description', value: guild.description || 'No description available.', inline: true },
        { name: 'Verification Level', value: verificationLevels[guild.verificationLevel], inline: true },
        { name: 'Boost Level', value: guild.premiumTier.toString(), inline: true },
        { name: 'Total Boosts', value: `${guild.premiumSubscriptionCount}`, inline: true },
        { name: 'AFK Channel', value: guild.afkChannel ? guild.afkChannel.name : 'None', inline: true },
        { name: 'AFK Timeout', value: `${guild.afkTimeout / 60} minutes`, inline: true },
        { name: 'Explicit Content Filter', value: explicitContentFilterLevels[guild.explicitContentFilter], inline: true },
        { name: 'Roles Count', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Emojis Count', value: `${guild.emojis.cache.size}`, inline: true },
        { name: 'Stickers Count', value: `${guild.stickers.cache.size}`, inline: true }
      )
      .setFooter({ text: `ID: ${guild.id}` })
      .setTimestamp();

    return interaction.reply({ embeds: [serverInfoEmbed], ephemeral: false });
  }
};
