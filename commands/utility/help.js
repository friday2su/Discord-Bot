const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commandsPath = path.join(__dirname, '../..', 'commands');

// Emojis for each category
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
    .setDescription('Displays the help menu for the bot.'),

  async execute(interaction) {
    const categories = fs.readdirSync(commandsPath);
    const botIcon = interaction.client.user.displayAvatarURL();

    let pageIndex = 0; // Index to track which page is displayed

    const generateHomeEmbed = () => ({
      color: 0x0099ff,
      title: '✨ Funio is here to help!',
      description: 'It is a multipurpose bot for your Discord. It can help you to build a Super server.',
      thumbnail: {
        url: botIcon,
      },
      fields: [
        { name: '📌 __BOT INFO__', value: `> :arrow_right: Prefix: \`${process.env.PREFIX}\`\n> :arrow_right: Discord.js Version: \`v${require('discord.js').version}\`\n> :arrow_right: Running on Node: \`${process.versions.node}\`\n> :arrow_right: Made by \`friday.su\`` },
        { name: '📋 __Available Categories__', value: categories.map(cat => `> ${categoryEmojis[cat] || '❓'} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`).join('\n') },
      ],
      footer: {
        text: 'Use the buttons below to navigate.',
      },
    });

    const generateCategoryEmbed = (index) => {
      const category = categories[index];
      const commandFiles = fs.readdirSync(path.join(commandsPath, category)).filter(file => file.endsWith('.js'));
      
      const commands = commandFiles.map(file => {
        const command = require(path.join(commandsPath, category, file));
        const subcommands = command.data.options ? command.data.options.map(option => option.name).join(', ') : 'No subcommands';
        return `> **/${command.data.name}**: ${subcommands}`;
      }).join('\n');

      return {
        color: 0x0099ff,
        title: `📋 __${category.charAt(0).toUpperCase() + category.slice(1)} Commands__`,
        description: commands || 'No commands available in this category.',
        footer: {
          text: `Page ${index + 1} of ${categories.length}`,
        },
      };
    };

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setLabel('Previous')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(pageIndex === 0),
        new ButtonBuilder()
          .setCustomId('home')
          .setLabel('Home')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Next')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(pageIndex === categories.length - 1)
      );

    const helpMessage = await interaction.reply({ embeds: [generateHomeEmbed()], components: [row], fetchReply: true });

    const filter = i => {
      i.deferUpdate();
      return i.user.id === interaction.user.id;
    };

    const collector = helpMessage.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      if (i.customId === 'next') {
        if (pageIndex < categories.length - 1) {
          pageIndex++;
          await interaction.editReply({ embeds: [generateCategoryEmbed(pageIndex)], components: [row] });
        }
      } else if (i.customId === 'prev') {
        if (pageIndex > 0) {
          pageIndex--;
          await interaction.editReply({ embeds: [generateCategoryEmbed(pageIndex)], components: [row] });
        }
      } else if (i.customId === 'home') {
        pageIndex = 0; // Reset to home page
        await interaction.editReply({ embeds: [generateHomeEmbed()], components: [row] });
      }
    });

    collector.on('end', collected => {
      row.components.forEach(button => button.setDisabled(true));
      interaction.editReply({ components: [row] });
    });
  },
};
