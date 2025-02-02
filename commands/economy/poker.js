const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const initialBet = 50;

let gameState = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poker')
    .setDescription('Chơi trò chơi Poker với bot và cược 50XC mỗi ván.')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('Chọn hành động (Blinds, Check, Call, Fold, All-in, Pot, Showdown)')
        .setRequired(true)
        .addChoices(
          { name: 'Blinds', value: 'blinds' },
          { name: 'Check', value: 'check' },
          { name: 'Call', value: 'call' },
          { name: 'Fold', value: 'fold' },
          { name: 'All-in', value: 'allin' },
          { name: 'Pot', value: 'pot' },
          { name: 'Showdown', value: 'showdown' }
        )
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const action = interaction.options.getString('action');

    if (!gameState[userId]) {
      // Khởi tạo bàn chơi cho người dùng mới
      gameState[userId] = {
        playerHand: [],
        botHand: [],
        pot: initialBet,
      };

      // Chia bài ngẫu nhiên
      gameState[userId].playerHand = getRandomHand();
      gameState[userId].botHand = getRandomHand();

      await interaction.reply(`Bạn đã cược 50XC. Đây là lá bài của bạn: ${formatHand(gameState[userId].playerHand)}`);
    } else {
      // Xử lý các hành động của người chơi
      handlePlayerAction(interaction, action, userId);
    }
  }
};

function getRandomHand() {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  return [
    { suit: suits[Math.floor(Math.random() * suits.length)], value: values[Math.floor(Math.random() * values.length)] },
    { suit: suits[Math.floor(Math.random() * suits.length)], value: values[Math.floor(Math.random() * values.length)] }
  ];
}

function formatHand(hand) {
  return hand.map(card => `${card.value}${card.suit}`).join(', ');
}

function calculateHandValue(hand) {
  const valueMap = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
  };
  return hand.reduce((sum, card) => sum + valueMap[card.value], 0);
}

function handlePlayerAction(interaction, action, userId) {
  const game = gameState[userId];
  switch (action) {
    case 'blinds':
      game.pot += initialBet;
      interaction.reply(`Bạn đã đặt thêm 50XC vào pot. Tổng pot hiện tại là ${game.pot}XC.`);
      break;
    case 'check':
      interaction.reply('Bạn đã chọn Check.');
      break;
    case 'call':
      game.pot += initialBet;
      interaction.reply(`Bạn đã Call. Tổng pot hiện tại là ${game.pot}XC.`);
      break;
    case 'fold':
      delete gameState[userId];
      interaction.reply('Bạn đã Fold và kết thúc ván chơi.');
      break;
    case 'allin':
      game.pot += 500;
      interaction.reply(`Bạn đã All-in với 500XC. Tổng pot hiện tại là ${game.pot}XC.`);
      break;
    case 'pot':
      interaction.reply(`Tổng pot hiện tại là ${game.pot}XC.`);
      break;
    case 'showdown':
      const playerValue = calculateHandValue(game.playerHand);
      const botValue = calculateHandValue(game.botHand);

      let resultMessage = `Showdown!\nLá bài bot là: ${formatHand(game.botHand)}\n`;
      resultMessage += `Điểm của bạn: ${playerValue}, Điểm của bot: ${botValue}\n`;

      if (playerValue > botValue) {
        resultMessage += '🎉 Bạn đã thắng!';
      } else if (playerValue < botValue) {
        resultMessage += '😢 Bạn đã thua!';
      } else {
        resultMessage += '🤝 Hòa!';
      }

      interaction.reply(resultMessage);
      break;
  }
}
