const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const commandsPath = path.join(__dirname, '../..', 'commands');

const categoryEmojis = {
  fun: '🎉',
  automod: '🤖',
  economy: '💰',
  moderation: '🔨',
  suggestion: '💡',
  giveaway: '🎁',
  ticket: '🎫',
  invites: '📩',
  utility: '🛠️',
  information: 'ℹ️',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Gõ bấn nút để xem lệnh.'),

  async execute(interaction) {
    const categories = fs.readdirSync(commandsPath);
    const botIcon = interaction.client.user.displayAvatarURL();
    let pageIndex = 0;
    
    let gifUrl = '';
    try {
      const response = await axios.get('https://nguyenmanh.name.vn/api/nsfw/hentaigif?apikey=PlUDcXkI');
      gifUrl = response.data.url;
    } catch (error) {
      console.error('Error fetching GIF:', error);
    }

    const generateHomeEmbed = () => {
      return new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('✨ Yuri ở đây để giúp các bé!')
        .setDescription('Nó là một bot đa năng cho Discord của bạn. Nó có thể giúp bạn xây dựng một siêu máy chủ.')
        .setThumbnail(botIcon)
        .addFields(
          { name: '📌 __BOT INFO__', value: `> :arrow_right: Prefix: \`${process.env.PREFIX}\`\n> :arrow_right: Discord.js Version: \`v${require('discord.js').version}\`\n> :arrow_right: Chạy trên Node: \`${process.versions.node}\`\n> :arrow_right: Made by \`Minh.son🎮\`` },
          { name: '📋 __Danh mục có sẵn__', value: categories.map(cat => `> ${categoryEmojis[cat] || '❓'} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`).join('\n') }
        )
        .setFooter({ text: '🦈Sử dụng các nút bên dưới để xem lệnh🖼️.' })
        .setImage(gifUrl || '');
    };

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder().setCustomId('prev').setLabel('Previous').setStyle(ButtonStyle.Primary).setDisabled(pageIndex === 0),
        new ButtonBuilder().setCustomId('home').setLabel('Home').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Primary).setDisabled(pageIndex === categories.length - 1)
      );

    const helpMessage = await interaction.reply({ embeds: [generateHomeEmbed()], components: [row], fetchReply: true });

    const filter = i => {
      i.deferUpdate();
      return i.user.id === interaction.user.id;
    };

    const collector = helpMessage.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      if (i.customId === 'home') {
        pageIndex = 0;
        await interaction.editReply({ embeds: [generateHomeEmbed()], components: [row] });
      }
    });

    collector.on('end', () => {
      row.components.forEach(button => button.setDisabled(true));
      interaction.editReply({ components: [row] });
    });
  },
};

