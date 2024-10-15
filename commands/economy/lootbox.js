const { SlashCommandBuilder } = require('discord.js');
const User = require('../../database/models/User');
const config = require('../../config');
const checkCooldown = require('../../helpers/checkCooldown');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lootbox')
    .setDescription('Open a lootbox for a random reward.'),
  async execute(interaction) {
    let user = await User.findOne({ userId: interaction.user.id });
    if (!user) {
      user = new User({
        userId: interaction.user.id,
        cash: 0,
        bank: 0,
        lastLootbox: null,
      });
    }

    // Cooldown check
    const cooldown = checkCooldown(user.lastLootbox, config.cooldowns.lootbox);
    if (cooldown.remaining) {
      return interaction.reply({ content: `🕒 | You can open another lootbox in **${cooldown.time}**!`, ephemeral: true });
    }

    // Randomize lootbox reward between 100 and 500
    const randomReward = Math.floor(Math.random() * 401) + 100;
    user.cash += randomReward;
    user.lastLootbox = Date.now();
    await user.save();

    await interaction.reply(`🎁 | You opened a lootbox and received **${randomReward} cash**!`);
  }
};
