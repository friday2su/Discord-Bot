const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('Give some cash to another user.')
    .addUserOption(option => option.setName('target').setDescription('The user to give cash').setRequired(true))
    .addIntegerOption(option => option.setName('amount').setDescription('Amount of cash to give').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const amount = interaction.options.getInteger('amount');

    const giver = await User.findOne({ userId: interaction.user.id });
    const receiver = await User.findOne({ userId: target.id });

    if (!giver || giver.cash < amount) {
      return interaction.reply({ content: 'You do not have enough cash to give.', ephemeral: true });
    }

    // Update balances
    giver.cash -= amount;
    receiver.cash += amount;

    await giver.save();
    await receiver.save();

    await interaction.reply(`💸 | You gave **${amount}** cash to **${target.username}**.`);
  }
};
