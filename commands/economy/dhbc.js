const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

let gameState = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dhbc')
    .setDescription('Chơi trò chơi Đuổi Hình Bắt Chữ với emoji.')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('Chọn hành động: guess (hiển thị emoji) hoặc rep (trả lời emoji)')
        .setRequired(true)
        .addChoices(
          { name: 'Guess', value: 'guess' },
          { name: 'Rep', value: 'rep' }
        )
    )
    .addStringOption(option =>
      option.setName('answer')
        .setDescription('Nhập câu trả lời của bạn (chỉ khi chọn rep)')
        .setRequired(false)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const action = interaction.options.getString('action');
    const userAnswer = interaction.options.getString('answer');

    if (!gameState[userId]) {
      gameState[userId] = {
        emoji1: null,
        emoji2: null,
        correctAnswer: null
      };
    }

    switch (action) {
      case 'guess':
        try {
          const response = await axios.get('https://nguyenmanh.name.vn/api/dhbcemoji?apikey=PlUDcXkI');
          const { emoji1, emoji2, wordcomplete } = response.data.result;

          gameState[userId] = {
            emoji1: emoji1,
            emoji2: emoji2,
            correctAnswer: wordcomplete
          };

          await interaction.reply(`🔍 Đoán từ qua emoji: ${emoji1} ${emoji2}`);
        } catch (error) {
          console.error('Lỗi khi gọi API:', error);
          await interaction.reply('Đã xảy ra lỗi khi lấy dữ liệu từ API. Vui lòng thử lại sau.');
        }
        break;

      case 'rep':
        if (!gameState[userId].correctAnswer) {
          await interaction.reply('Vui lòng sử dụng lệnh guess trước khi trả lời.');
          return;
        }

        if (userAnswer && userAnswer.trim().toUpperCase() === gameState[userId].correctAnswer.toUpperCase()) {
          await interaction.reply(`🎉 Chính xác! Đáp án là **${gameState[userId].correctAnswer}**.`);
        } else {
          await interaction.reply(`❌ Sai rồi! Đáp án đúng là **${gameState[userId].correctAnswer}**.`);
        }

        // Reset game state và chờ 3 giây trước khi cho phép chơi tiếp
        setTimeout(() => {
          gameState[userId] = {
            emoji1: null,
            emoji2: null,
            correctAnswer: null
          };
          interaction.followUp('Bạn có thể tiếp tục sử dụng lệnh sau 3 giây!');
        }, 3000);
        break;
    }
  }
};
