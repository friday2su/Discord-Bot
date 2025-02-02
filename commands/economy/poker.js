const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const initialBet = 50;
const minBlindsBet = 50;
const maxBlindsBet = 100;
const minBet = 500;
const maxBet = 1000;

let gameState = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poker')
    .setDescription('Chơi trò chơi Poker với bot và đặt cược ngẫu nhiên mỗi ván.')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('Chọn hành động (Blinds, Check, Call, Fold, All-in, Pot, Showdown, Var)')
        .setRequired(true)
        .addChoices(
          { name: 'Blinds', value: 'blinds' },
          { name: 'Check', value: 'check' },
          { name: 'Call', value: 'call' },
          { name: 'Fold', value: 'fold' },
          { name: 'All-in', value: 'allin' },
          { name: 'Pot', value: 'pot' },
          { name: 'Showdown', value: 'showdown' },
          { name: 'Var', value: 'var' }
        )
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const action = interaction.options.getString('action');

    if (!gameState[userId]) {
      gameState[userId] = {
        playerHand: [],
        botHand: [],
        pot: getRandomBet(),
        playerBalance: 1000, // Thêm thuộc tính số dư của người chơi
      };

      gameState[userId].playerHand = getRandomHand();
      gameState[userId].botHand = getRandomHand();

      await interaction.reply(`Bạn đã cược ${gameState[userId].pot}XC. Đây là lá bài của bạn: ${formatHand(gameState[userId].playerHand)}`);
    } else {
      handlePlayerAction(interaction, action, userId);
    }
  }
};

function getRandomBet() {
  return Math.floor(Math.random() * (maxBet - minBet + 1)) + minBet;
}

function getRandomBlindsBet() {
  return Math.floor(Math.random() * (maxBlindsBet - minBlindsBet + 1)) + minBlindsBet;
}

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
      const blindsBet = getRandomBlindsBet();
      game.pot += blindsBet;
      interaction.reply(`Bạn đã đặt cược ngẫu nhiên ${blindsBet}XC vào pot. Tổng pot hiện tại là ${game.pot}XC.`);
      break;
    case 'check':
      interaction.reply('Bạn đã chọn Check. Bài đã bị hủy và ván cược sẽ được thiết lập lại với lá bài mới.');
      resetGame(interaction, userId);
      break;
    case 'call':
      game.pot += initialBet;
      interaction.reply(`Bạn đã Call. Tổng pot hiện tại là ${game.pot}XC.`);
      break;
    case 'fold':
      delete gameState[userId];
      interaction.reply('Bạn đã Fold và bot cũng bỏ bài. Chờ 5 giây để ván mới bắt đầu...');
      setTimeout(() => {
        resetGame(interaction, userId);
      }, 5000);
      break;
    case 'allin':
      const allInBet = getRandomBet();
      game.pot += allInBet;
      interaction.reply(`Bạn đã All-in với ${allInBet}XC. Tổng pot hiện tại là ${game.pot}XC.`);
      break;
    case 'pot':
      interaction.reply(`Tổng pot hiện tại là ${game.pot}XC.`);
      break;
    case 'showdown':
      const playerValue = calculateHandValue(game.playerHand);
      const botValue = calculateHandValue(game.botHand);

      let resultMessage = `Showdown!
Lá bài bot là: ${formatHand(game.botHand)}
`;
      resultMessage += `Điểm của bạn: ${playerValue}, Điểm của bot: ${botValue}
`;

      if (playerValue > botValue) {
        const winnings = game.pot * 2;
        game.playerBalance += winnings;
        resultMessage += `🎉 Bạn đã thắng và nhận được ${winnings}XC! Số dư hiện tại của bạn là ${game.playerBalance}XC.`;
      } else if (playerValue < botValue) {
        game.playerBalance -= game.pot;
        resultMessage += `😢 Bạn đã thua và mất ${game.pot}XC. Số dư hiện tại của bạn là ${game.playerBalance}XC.`;
      } else {
        resultMessage += '🤝 Hòa!';
      }

      interaction.reply(resultMessage);
      break;
    case 'var':
      const playerHandValue = calculateHandValue(game.playerHand);
      interaction.reply(`Lá bài của bạn: ${formatHand(game.playerHand)} với tổng điểm là ${playerHandValue}. Số dư hiện tại của bạn là ${game.playerBalance}XC.`);
      break;
  }
}

function resetGame(interaction, userId) {
  gameState[userId] = {
    playerHand: getRandomHand(),
    botHand: getRandomHand(),
    pot: getRandomBet(),
    playerBalance: gameState[userId].playerBalance, // Giữ nguyên số dư
  };
  interaction.followUp(`Ván mới bắt đầu! Bạn đã cược ${gameState[userId].pot}XC. Đây là lá bài của bạn: ${formatHand(gameState[userId].playerHand)}`);
}
