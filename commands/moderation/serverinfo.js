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
        { name: 'Tên Sever🌐', value: guild.name, inline: true },
        { name: 'Vùng đất🐳', value: guild.preferredLocale, inline: true },
        { name: 'Số members🧑‍🤝‍🧑', value: `${guild.memberCount}`, inline: true },
        { name: 'Được tạo vào ngày🌸', value: `${guild.createdAt.toDateString()}`, inline: true },
        { name: '💐Chủ Bot💐', value: `${guild.ownerId ? `<@${guild.ownerId}>` : 'Unknown'}`, inline: true },
        { name: 'Mô Tả', value: guild.description || 'No description available.', inline: true },
        { name: 'Cấp độ xác minh🎚️', value: verificationLevels[guild.verificationLevel], inline: true },
        { name: 'Level của sever', value: guild.premiumTier.toString(), inline: true },
        { name: 'Total Boosts', value: `${guild.premiumSubscriptionCount}`, inline: true },
        { name: 'Kênh AFK', value: guild.afkChannel ? guild.afkChannel.name : 'None', inline: true },
        { name: 'Hết Gìa AFK', value: `${guild.afkTimeout / 60} minutes`, inline: true },
        { name: 'Bộ lọc nội dung rõ ràng📝', value: explicitContentFilterLevels[guild.explicitContentFilter], inline: true },
        { name: 'Roles🎫 Count', value: `${guild.roles.cache.size}`, inline: true },
        { name: '🌸Số Emojis😏', value: `${guild.emojis.cache.size}`, inline: true },
        { name: '🎫Số Stickers🪼', value: `${guild.stickers.cache.size}`, inline: true }
      )
      .setFooter({ text: `ID: ${guild.id}` })
      .setTimestamp();

    return interaction.reply({ embeds: [serverInfoEmbed], ephemeral: false });
  }
};
