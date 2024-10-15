const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Assigns or removes a role from a user.')
    .addUserOption(option => option.setName('user').setDescription('User to modify').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Role to assign/remove').setRequired(true))
    .addStringOption(option => 
      option.setName('action')
        .setDescription('Choose whether to add or remove the role.')
        .setRequired(true)
        .addChoices(
          { name: 'Add', value: 'add' },
          { name: 'Remove', value: 'remove' }
        )),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const action = interaction.options.getString('action');
    const member = await interaction.guild.members.fetch(user.id);

    // Check if the command issuer has permission to manage roles
    if (!interaction.member.permissions.has('MANAGE_ROLES')) {
      return interaction.reply({ content: 'You do not have permission to manage roles.', ephemeral: true });
    }

    // Add or remove the role based on the action
    if (action === 'add') {
      // Check if the member already has the role
      if (member.roles.cache.has(role.id)) {
        return interaction.reply({ content: `🎭 | **${user.tag}** already has the role **${role.name}**.`, ephemeral: true });
      } else {
        await member.roles.add(role);
        return interaction.reply(`🎭 | Assigned role **${role.name}** to **${user.tag}**.`);
      }
    } else if (action === 'remove') {
      // Check if the member has the role to remove
      if (!member.roles.cache.has(role.id)) {
        return interaction.reply({ content: `🎭 | **${user.tag}** does not have the role **${role.name}**.`, ephemeral: true });
      } else {
        await member.roles.remove(role);
        return interaction.reply(`🎭 | Removed role **${role.name}** from **${user.tag}**.`);
      }
    }
  }
};
