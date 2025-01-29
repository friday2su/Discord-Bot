const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tarot')
    .setDescription('Rút một lá bài Tarot ngẫu nhiên và hiển thị thông tin của nó.'),
  
  async execute(interaction) {
    try {
      // Gọi API để lấy thông tin lá bài Tarot
      const response = await axios.get('https://subhatde.id.vn/tarot');
      const tarotCards = response.data;

      // Chọn một lá bài ngẫu nhiên
      const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];

      // Tạo thông điệp để gửi
      const resultMessage = `
        **==Tên==:** ${randomCard.name}
        **==Bộ bài🃏==:** ${randomCard.suite}
        **==Mô tả📝==:** ${randomCard.vi.description}
        **==Diễn giải🏫==:** ${randomCard.vi.interpretation}
        **==Diễn giải ngược==:** ${randomCard.vi.reversed}
        **==Hình ảnh🖼️==:** ${randomCard.image}
      `;

      // Gửi thông điệp đến người dùng
      await interaction.reply({ content: resultMessage });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "Có lỗi xảy ra khi rút bài Tarot. Vui lòng thử lại sau.", ephemeral: true });
    }
  }
};
