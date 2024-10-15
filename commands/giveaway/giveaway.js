const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Giveaway = require('../../database/models/Giveaway');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Manage giveaways')
    .addSubcommand(subcommand =>
      subcommand
        .setName('start')
        .setDescription('Start a giveaway')
        .addStringOption(option => option.setName('duration').setDescription('Duration (e.g. 10s, 1m, 2h)').setRequired(true))
        .addIntegerOption(option => option.setName('winners').setDescription('Number of winners').setRequired(true))
        .addStringOption(option => option.setName('prize').setDescription('Prize for the giveaway').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('end')
        .setDescription('End a giveaway')
        .addStringOption(option => option.setName('message_id').setDescription('Message ID of the giveaway').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('cancel')
        .setDescription('Cancel a giveaway')
        .addStringOption(option => option.setName('message_id').setDescription('Message ID of the giveaway').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('drop')
        .setDescription('Drop a giveaway in the channel')
        .addIntegerOption(option => option.setName('winners').setDescription('Number of winners').setRequired(true))
        .addStringOption(option => option.setName('prize').setDescription('Prize for the giveaway').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('Edit a giveaway')
        .addStringOption(option => option.setName('message_id').setDescription('Message ID of the giveaway').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('New duration (e.g. 10s, 1m, 2h)').setRequired(false))
        .addIntegerOption(option => option.setName('winners').setDescription('New number of winners').setRequired(false))
        .addStringOption(option => option.setName('prize').setDescription('New prize for the giveaway').setRequired(false))),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'start':
        await startGiveaway(interaction);
        break;
      case 'end':
        await endGiveaway(interaction);
        break;
      case 'cancel':
        await cancelGiveaway(interaction);
        break;
      case 'drop':
        await dropGiveaway(interaction);
        break;
      case 'edit':
        await editGiveaway(interaction);
        break;
      default:
        await interaction.reply('Unknown subcommand.');
    }
  },
};

// Function to convert duration to milliseconds
function parseDuration(duration) {
  const timeUnitRegex = /(\d+)([smhwd])/g;
  let totalMilliseconds = 0;
  let match;

  while ((match = timeUnitRegex.exec(duration)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2];
    
    switch (unit) {
      case 's':
        totalMilliseconds += value * 1000;
        break;
      case 'm':
        totalMilliseconds += value * 60 * 1000;
        break;
      case 'h':
        totalMilliseconds += value * 60 * 60 * 1000;
        break;
      case 'd':
        totalMilliseconds += value * 24 * 60 * 60 * 1000;
        break;
      case 'w':
        totalMilliseconds += value * 7 * 24 * 60 * 60 * 1000;
        break;
    }
  }

  return totalMilliseconds;
}

// Function to start a giveaway
async function startGiveaway(interaction) {
  const durationInput = interaction.options.getString('duration');
  const winners = interaction.options.getInteger('winners');
  const prize = interaction.options.getString('prize');

  const duration = parseDuration(durationInput);
  if (duration <= 0) {
    return interaction.reply('Invalid duration specified.');
  }

  const endTime = Date.now() + duration;

  const embed = new EmbedBuilder()
    .setTitle('🎉 Giveaway! 🎉')
    .setDescription(`Prize: ${prize}\nWinners: ${winners}\nEnds in: ${durationInput}\nReact with 🎉 to enter!`)
    .setFooter({ text: `Ends at: ${new Date(endTime).toLocaleString()}` });

  const message = await interaction.channel.send({ embeds: [embed] });
  await message.react('🎉');

  const giveaway = new Giveaway({
    messageId: message.id,
    channelId: interaction.channel.id,
    guildId: interaction.guild.id,
    duration: duration,
    winners: winners,
    prize: prize,
    participants: [],
    ended: false,
  });

  await giveaway.save();

  const filter = (reaction, user) => {
    return reaction.emoji.name === '🎉' && !user.bot;
  };

  const collector = message.createReactionCollector({
    filter,
    time: duration,
  });

  collector.on('collect', async (reaction, user) => {
    if (!giveaway.participants.includes(user.id)) {
      giveaway.participants.push(user.id);
      await giveaway.save();
    }
  });

  collector.on('remove', async (reaction, user) => {
    const index = giveaway.participants.indexOf(user.id);
    if (index > -1) {
      giveaway.participants.splice(index, 1);
      await giveaway.save();
    }
  });

  // Countdown in seconds
  const interval = setInterval(async () => {
    const timeLeft = endTime - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      await endGiveawayById(message.id, interaction.guild, interaction);
    } else {
      const secondsLeft = Math.round(timeLeft / 1000);
      embed.setDescription(`Prize: ${prize}\nWinners: ${winners}\nEnds in: ${secondsLeft}s\nReact with 🎉 to enter!`);
      await message.edit({ embeds: [embed] });
    }
  }, 1000);

  await interaction.reply(`Giveaway started! It will end in ${durationInput}.`);
}

// Function to end a giveaway
async function endGiveaway(interaction) {
  const messageId = interaction.options.getString('message_id');
  const giveaway = await Giveaway.findOne({ messageId });

  if (!giveaway || giveaway.ended) {
    return interaction.reply('Giveaway not found or already ended.');
  }

  await endGiveawayById(messageId, interaction.guild, interaction);
  await interaction.reply('Giveaway has been ended.');
}

// Function to cancel a giveaway
async function cancelGiveaway(interaction) {
  const messageId = interaction.options.getString('message_id');
  const giveaway = await Giveaway.findOne({ messageId });

  if (!giveaway) {
    return interaction.reply('Giveaway not found.');
  }

  const channel = await interaction.guild.channels.fetch(giveaway.channelId);
  const message = await channel.messages.fetch(messageId);
  
  await message.delete();
  await giveaway.delete();

  await interaction.reply('Giveaway has been canceled.');
}

// Function to drop a giveaway
async function dropGiveaway(interaction) {
  const winners = interaction.options.getInteger('winners');
  const prize = interaction.options.getString('prize');

  const embed = new EmbedBuilder()
    .setTitle('🎉 Giveaway Drop! 🎉')
    .setDescription(`Prize: ${prize}\nWinners: ${winners}\nReact with 🎉 to enter!`);

  const message = await interaction.channel.send({ embeds: [embed] });
  await message.react('🎉');

  const giveaway = new Giveaway({
    messageId: message.id,
    channelId: interaction.channel.id,
    guildId: interaction.guild.id,
    duration: 0, // No duration for drop
    winners: winners,
    prize: prize,
    participants: [],
    ended: false,
  });

  await giveaway.save();
  await interaction.reply(`Giveaway dropped!`);
}

// Function to edit a giveaway
async function editGiveaway(interaction) {
  if (!interaction.member.permissions.has('MANAGE_GUILD')) {
    return interaction.reply('You do not have permission to edit a giveaway.');
  }

  const messageId = interaction.options.getString('message_id');
  const durationInput = interaction.options.getString('duration');
  const winners = interaction.options.getInteger('winners');
  const prize = interaction.options.getString('prize');

  const giveaway = await Giveaway.findOne({ messageId });

  if (!giveaway) {
    return interaction.reply('Giveaway not found.');
  }

  if (durationInput) {
    const duration = parseDuration(durationInput);
    giveaway.duration = duration;
  }

  if (winners) {
    giveaway.winners = winners;
  }

  if (prize) {
    giveaway.prize = prize;
  }

  await giveaway.save();
  await interaction.reply('Giveaway has been edited.');
}

// Function to end a giveaway by message ID
async function endGiveawayById(messageId, guild, interaction) {
  const giveaway = await Giveaway.findOne({ messageId });

  if (!giveaway || giveaway.ended) return;

  const channel = await guild.channels.fetch(giveaway.channelId);
  const message = await channel.messages.fetch(messageId);

  const participants = giveaway.participants;
  if (participants.length === 0) {
    await message.channel.send('No participants entered the giveaway.');
    giveaway.ended = true;
    await giveaway.save();
    return;
  }

  const winners = [];
  for (let i = 0; i < giveaway.winners; i++) {
    const winner = participants[Math.floor(Math.random() * participants.length)];
    if (winners.includes(winner)) continue;
    winners.push(winner);
  }

  const winnerUsernames = winners.map(id => `<@${id}>`).join(', ');

  const winnerEmbed = new EmbedBuilder()
    .setTitle('🎉 Giveaway Ended! 🎉')
    .setDescription(`Prize: ${giveaway.prize}\nWinners: ${winnerUsernames}`);

  await message.channel.send({ embeds: [winnerEmbed] });

  giveaway.ended = true;
  await giveaway.save();
}
