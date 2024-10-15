const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin and try your luck.')
    .addIntegerOption(option => 
      option.setName('bet')
        .setDescription('Amount to bet')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('side')
        .setDescription('Heads or Tails')
        .setRequired(true)
        .addChoices(
          { name: 'Heads', value: 'heads' },
          { name: 'Tails', value: 'tails' }
        )),
  async execute(interaction) {
    const bet = interaction.options.getInteger('bet');
    const side = interaction.options.getString('side').toLowerCase();
    const user = await User.findOne({ userId: interaction.user.id });

    if (!user || user.cash < bet) {
      return interaction.reply({ content: 'You don\'t have enough cash to bet.', ephemeral: true });
    }

    const flip = Math.random() < 0.5 ? 'heads' : 'tails';
    if (side === flip) {
      user.cash += bet; // Double the bet if correct
      await user.save();
      return interaction.reply(`🎉 | It landed on **${flip}**! You won and earned **${bet} cash**!`);
    } else {
      user.cash -= bet; // Lose the bet if incorrect
      await user.save();
      return interaction.reply(`❌ | It landed on **${flip}**. You lost **${bet} cash**.`);
    }
  }
};
