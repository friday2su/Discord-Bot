const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Play the slot machine and try your luck.')
    .addIntegerOption(option => option.setName('bet').setDescription('Amount to bet').setRequired(true)),
  async execute(interaction) {
    const bet = interaction.options.getInteger('bet');
    const user = await User.findOne({ userId: interaction.user.id });

    if (!user || user.cash < bet) {
      return interaction.reply({ content: 'You don\'t have enough cash to bet.', ephemeral: true });
    }

    const slotResults = ['🍒', '🍋', '🍊'];
    const roll = Array(3).fill().map(() => slotResults[Math.floor(Math.random() * slotResults.length)]);

    if (roll.every(symbol => symbol === roll[0])) {
      user.cash += bet * 3; // Triple win
      await user.save();
      return interaction.reply(`🎉 | You won! **${roll.join(' | ')}** You tripled your bet and earned **${bet * 3} cash**!`);
    } else {
      user.cash -= bet; // Lose the bet
      await user.save();
      return interaction.reply(`❌ | You lost! **${roll.join(' | ')}** You lost **${bet} cash**.`);
    }
  }
};
