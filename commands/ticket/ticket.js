const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');
const Ticket = require('../../database/models/ticket');
const { createTranscript } = require('discord-html-transcripts'); // For transcript creation

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticketing system commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Setup the ticket system')
        .addChannelOption(option => option.setName('channel').setDescription('Channel for ticket creation').setRequired(true))
        .addRoleOption(option => option.setName('staff-role').setDescription('Role for staff').setRequired(true))
        .addChannelOption(option => option.setName('logs').setDescription('Log channel for tickets').setRequired(true))
        .addChannelOption(option => option.setName('transcript').setDescription('Channel for transcripts').setRequired(true))
        .addStringOption(option => option.setName('title').setDescription('Title for ticket message').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Description for ticket message').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a user from the ticket channel')
        .addUserOption(option => option.setName('user').setDescription('User to remove').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a user to the ticket channel')
        .addUserOption(option => option.setName('user').setDescription('User to add').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('close')
        .setDescription('Close the ticket and delete the ticket channel.'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('transcript')
        .setDescription('Get a transcript of the ticket.')),

  async execute(interaction) {
    const { options } = interaction;
    const subcommand = options.getSubcommand();

    if (subcommand === 'setup') {
      const channel = options.getChannel('channel');
      const staffRole = options.getRole('staff-role');
      const logsChannel = options.getChannel('logs');
      const transcriptChannel = options.getChannel('transcript');
      const title = options.getString('title');
      const description = options.getString('description');

      // Create a new ticket document
      const ticket = new Ticket({
        channelId: channel.id,
        staffRoleId: staffRole.id,
        logsChannelId: logsChannel.id,
        transcriptChannelId: transcriptChannel.id,
        title,
        description,
      });

      await ticket.save();

      // Create ticket creation embed
      const ticketEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(title)
        .setDescription(description)
        .setFooter({ text: 'Click the button below to create a ticket.' });

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('create_ticket')
            .setLabel('Create Ticket')
            .setStyle(ButtonStyle.Primary)
        );

      // Send the embed in the specified channel
      await channel.send({ embeds: [ticketEmbed], components: [row] });
      await interaction.reply(`🎫 | Ticket system set up successfully in ${channel}. Title: **${title}**.`);
    } else if (subcommand === 'remove') {
      const user = options.getUser('user');
      const member = await interaction.guild.members.fetch(user.id);

      // Check if the member is in the ticket channel
      if (interaction.channel.permissionsFor(member).has(PermissionsBitField.Flags.ViewChannel)) {
        await interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: false });
        await interaction.reply(`❌ | Removed **${user.tag}** from the ticket channel.`);
      } else {
        await interaction.reply(`⚠️ | **${user.tag}** is not in the ticket channel.`);
      }
    } else if (subcommand === 'add') {
      const user = options.getUser('user');
      const member = await interaction.guild.members.fetch(user.id);

      // Check if the member is in the ticket channel
      if (!interaction.channel.permissionsFor(member).has(PermissionsBitField.Flags.ViewChannel)) {
        await interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: true });
        await interaction.reply(`✅ | Added **${user.tag}** to the ticket channel.`);
      } else {
        await interaction.reply(`⚠️ | **${user.tag}** is already in the ticket channel.`);
      }
    } else if (subcommand === 'close') {
      // Close the ticket
      const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
      if (!ticket) {
        return interaction.reply(`❌ | This channel is not associated with an open ticket.`);
      }

      // Fetch the logs and transcript channels from the database
      const logsChannel = interaction.guild.channels.cache.get(ticket.logsChannelId);
      const transcriptChannel = interaction.guild.channels.cache.get(ticket.transcriptChannelId);

      // Generate a transcript of the ticket
      const transcript = await createTranscript(interaction.channel);

      // Send the transcript to the transcript channel
      await transcriptChannel.send({
        content: `Transcript for ticket #${ticket.ticketNumber} created by <@${ticket.userId}>.`,
        files: [transcript],
      });

      // Optionally, send a notification to the logs channel
      if (logsChannel) {
        await logsChannel.send(`📝 | Ticket #${ticket.ticketNumber} was closed by ${interaction.user.tag} and a transcript was saved.`);
      }

      // Delete the ticket from the database
      await Ticket.deleteOne({ channelId: interaction.channel.id });

      // Delete the ticket channel
      await interaction.channel.delete();
    } else if (subcommand === 'transcript') {
      // Fetch the ticket from the database
      const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
      if (!ticket) {
        return interaction.reply(`❌ | This channel is not associated with an open ticket.`);
      }

      // Generate a transcript of the ticket
      const transcript = await createTranscript(interaction.channel);

      // Send the transcript to the transcript channel
      const transcriptChannel = interaction.guild.channels.cache.get(ticket.transcriptChannelId);
      await transcriptChannel.send({
        content: `Transcript for ticket #${ticket.ticketNumber} created by <@${ticket.userId}>.`,
        files: [transcript],
      });

      await interaction.reply(`📜 | Transcript for this ticket has been sent to ${transcriptChannel}.`);
    }
  },
};
