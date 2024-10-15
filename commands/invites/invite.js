const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const Invite = require('../../database/models/invite'); // Assuming you have an Invite model

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invites')
    .setDescription('Manage invites and rewards')
    .addSubcommand(subcommand =>
      subcommand.setName('user')
        .setDescription('Check a user\'s invites')
        .addUserOption(option => option.setName('user').setDescription('The user to check').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand.setName('add')
        .setDescription('Add invites to a user (Owner only)')
        .addUserOption(option => option.setName('user').setDescription('The user to add invites to').setRequired(true))
        .addIntegerOption(option => option.setName('number').setDescription('Number of invites').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand.setName('remove')
        .setDescription('Remove invites from a user (Owner only)')
        .addUserOption(option => option.setName('user').setDescription('The user to remove invites from').setRequired(true))
        .addIntegerOption(option => option.setName('number').setDescription('Number of invites').setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand.setName('leaderboard')
        .setDescription('View the top inviters leaderboard'))
    .addSubcommand(subcommand =>
      subcommand.setName('reset')
        .setDescription('Reset a user\'s invites (Owner only)')
        .addUserOption(option => option.setName('user').setDescription('The user to reset').setRequired(true))),
    
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const targetUser = interaction.options.getUser('user');
    const number = interaction.options.getInteger('number');
    const guildId = interaction.guild.id;
    const isOwner = interaction.guild.ownerId === interaction.user.id;

    // Check for owner-only commands
    if (!isOwner && ['add', 'remove', 'reset'].includes(subcommand)) {
      return interaction.reply({ content: 'Only the server owner can use this command!', ephemeral: true });
    }

    switch (subcommand) {
      case 'user': {
        // Check a user's invites
        const userInvites = await Invite.findOne({ userId: targetUser.id, guildId });
        const invitesCount = userInvites ? userInvites.invites : 0;
        return interaction.reply({ content: `${targetUser.username} has ${invitesCount} invites.` });
      }

      case 'add': {
        // Add invites to a user
        const userInvites = await Invite.findOneAndUpdate(
          { userId: targetUser.id, guildId },
          { $inc: { invites: number } },
          { upsert: true, new: true }
        );
        return interaction.reply({ content: `Added ${number} invites to ${targetUser.username}. They now have ${userInvites.invites} invites.` });
      }

      case 'remove': {
        // Remove invites from a user
        const userInvites = await Invite.findOneAndUpdate(
          { userId: targetUser.id, guildId },
          { $inc: { invites: -number } },
          { upsert: true, new: true }
        );
        return interaction.reply({ content: `Removed ${number} invites from ${targetUser.username}. They now have ${userInvites.invites} invites.` });
      }

      case 'leaderboard': {
        // Display the invite leaderboard using EmbedBuilder
        const topInviters = await Invite.find({ guildId }).sort({ invites: -1 }).limit(10);
        if (topInviters.length === 0) {
          return interaction.reply({ content: 'No invite data available yet.' });
        }

        const leaderboard = topInviters.map((invite, index) =>
          `${index + 1}. <@${invite.userId}> - **${invite.invites} invites**`
        ).join('\n');

        const leaderboardEmbed = new EmbedBuilder()
          .setTitle('🏆 Invite Leaderboard')
          .setColor('Gold')
          .setDescription(leaderboard)
          .setFooter({ text: `Top ${topInviters.length} inviters in ${interaction.guild.name}` })
          .setTimestamp();

        return interaction.reply({ embeds: [leaderboardEmbed] });
      }

      case 'reset': {
        // Reset a user's invites
        await Invite.findOneAndUpdate(
          { userId: targetUser.id, guildId },
          { invites: 0 },
          { new: true }
        );
        return interaction.reply({ content: `Reset invites for ${targetUser.username}.` });
      }
    }
  }
};
