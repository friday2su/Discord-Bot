const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tarot')
    .setDescription('Rút một lá bài Tarot ngẫu nhiên và hiển thị thông tin của nó.'),
  
  async execute(interaction) {
    try {
      const response = await axios.get('https://subhatde.id.vn/tarot');
      const tarotCards = response.data;

      const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];

      const resultMessage = `
        **==Tên==:** ${randomCard.name}
        **==Bộ bài🃏==:** ${randomCard.suite}
        **==Mô tả📝==:** ${randomCard.vi.description}
        **==Diễn giải🏫==:** ${randomCard.vi.interpretation}
        **==Diễn giải ngược==:** ${randomCard.vi.reversed}
        **==Hình ảnh🖼️==:** ${randomCard.image}
      `;

      await interaction.reply({ content: resultMessage });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "Có lỗi xảy ra khi rút bài Tarot. Vui lòng thử lại sau.", ephemeral: true });
    }
  }
};
