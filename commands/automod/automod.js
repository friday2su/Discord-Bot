const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const AutoMod = require('../../database/models/automod'); // Assuming you have the AutoMod model

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('Configure automod settings')
    .addSubcommand(subcommand =>
      subcommand.setName('antiinvites')
        .setDescription('Enable or disable invite link detection')
        .addStringOption(option => 
          option.setName('status')
            .setDescription('Enable or disable')
            .setRequired(true)
            .addChoices(
              { name: 'Enable', value: 'enable' },
              { name: 'Disable', value: 'disable' }
            )))
    .addSubcommand(subcommand =>
      subcommand.setName('antilinks')
        .setDescription('Enable or disable general link detection')
        .addStringOption(option => 
          option.setName('status')
            .setDescription('Enable or disable')
            .setRequired(true)
            .addChoices(
              { name: 'Enable', value: 'enable' },
              { name: 'Disable', value: 'disable' }
            )))
    .addSubcommand(subcommand =>
      subcommand.setName('antispam')
        .setDescription('Enable or disable spam detection')
        .addStringOption(option => 
          option.setName('status')
            .setDescription('Enable or disable')
            .setRequired(true)
            .addChoices(
              { name: 'Enable', value: 'enable' },
              { name: 'Disable', value: 'disable' }
            )))
    .addSubcommand(subcommand =>
      subcommand.setName('whitelist')
        .setDescription('Add or remove users/roles from the automod whitelist')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('Add or remove')
            .setRequired(true)
            .addChoices(
              { name: 'Add', value: 'add' },
              { name: 'Remove', value: 'remove' }
            ))
        .addMentionableOption(option => 
          option.setName('target')
            .setDescription('The user or role to add/remove from the whitelist')
            .setRequired(true))),
  
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const subcommand = interaction.options.getSubcommand();
    const status = interaction.options.getString('status');
    const action = interaction.options.getString('action');
    const target = interaction.options.getMentionable('target');

    // Fetch or create automod settings for the guild
    let autoModSettings = await AutoMod.findOne({ guildId });
    if (!autoModSettings) {
      autoModSettings = new AutoMod({ guildId });
      await autoModSettings.save();
    }

    switch (subcommand) {
      case 'antiinvites': {
        // Enable or disable invite link detection
        if (status === 'enable') {
          autoModSettings.antiInvites = true;
          await autoModSettings.save();
          return interaction.reply({ content: 'Anti-Invite link detection has been enabled.', ephemeral: true });
        } else {
          autoModSettings.antiInvites = false;
          await autoModSettings.save();
          return interaction.reply({ content: 'Anti-Invite link detection has been disabled.', ephemeral: true });
        }
      }

      case 'antilinks': {
        // Enable or disable general link detection
        if (status === 'enable') {
          autoModSettings.antiLinks = true;
          await autoModSettings.save();
          return interaction.reply({ content: 'Anti-Link detection has been enabled.', ephemeral: true });
        } else {
          autoModSettings.antiLinks = false;
          await autoModSettings.save();
          return interaction.reply({ content: 'Anti-Link detection has been disabled.', ephemeral: true });
        }
      }

      case 'antispam': {
        // Enable or disable spam detection
        if (status === 'enable') {
          autoModSettings.antiSpam = true;
          await autoModSettings.save();
          return interaction.reply({ content: 'Anti-Spam detection has been enabled.', ephemeral: true });
        } else {
          autoModSettings.antiSpam = false;
          await autoModSettings.save();
          return interaction.reply({ content: 'Anti-Spam detection has been disabled.', ephemeral: true });
        }
      }

      case 'whitelist': {
        // Add or remove user/role from whitelist
        const targetId = target.id;
        if (action === 'add') {
          if (autoModSettings.whitelist.includes(targetId)) {
            return interaction.reply({ content: 'This user/role is already in the whitelist.', ephemeral: true });
          }
          autoModSettings.whitelist.push(targetId);
          await autoModSettings.save();
          return interaction.reply({ content: `Added <@${targetId}> to the whitelist.`, ephemeral: true });
        } else if (action === 'remove') {
          const index = autoModSettings.whitelist.indexOf(targetId);
          if (index === -1) {
            return interaction.reply({ content: 'This user/role is not in the whitelist.', ephemeral: true });
          }
          autoModSettings.whitelist.splice(index, 1);
          await autoModSettings.save();
          return interaction.reply({ content: `Removed <@${targetId}> from the whitelist.`, ephemeral: true });
        }
      }
    }
  }
};
