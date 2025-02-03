const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

// Dùng map để theo dõi các phản hồi trước của từng người dùng
const previousResponses = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('Yuri')
    .setDescription('Đặt câu hỏi cho Yuri béo')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('Nhập câu hỏi hoặc nội dung bạn muốn yuri trả lời')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    let query = interaction.options.getString('prompt');

    // Kiểm tra nếu người dùng đã có phản hồi trước
    const previousResponse = previousResponses.get(userId);
    if (previousResponse) {
      query = `Follow-up on: "${previousResponse}"\nUser reply: "${query}"`;
    }

    const apiUrl = `https://zaikyoo.onrender.com/api/deepseek?prompt=${encodeURIComponent(query)}&uid=${userId}`;

    try {
      await interaction.deferReply(); // Chờ phản hồi từ API

      // Gọi API AI để lấy kết quả
      const response = await axios.get(apiUrl);

      if (response.data && !response.data.error) {
        const gptResponse = response.data.result || '𝐘𝐮𝐫𝐢 𝐛𝐢̣ 𝐜𝐚̂𝐦, đ𝐞́𝐨 𝐭𝐫𝐚̉ 𝐥𝐨̛̀𝐢 đ𝐨𝐮𝐮😏🌸.';
        previousResponses.set(userId, gptResponse); // Lưu phản hồi
        await interaction.editReply(`🗨️✨ **𝗬𝘂𝗿𝗶 𝗸𝗵𝗼𝗻𝗴 𝗯𝗲𝗹 giúp nè:**\n━━━━━━━━━━━━━━━━\n${gptResponse}\n━━━━━━━━━━━━━━━━`);
      } else {
        await interaction.editReply(`❗ Lỗi: ${response.data.error || '𝐿𝑜̂̃𝑖, 𝗬𝘂𝗿𝗶 𝗸𝗵𝗼𝗻𝗴 𝗯𝗲𝗹🔮 𝑑𝑒́𝑜 𝑟𝑒𝑝 𝑑𝑢̛𝑜̛̣𝑐 𝑡𝑢̛̀ 𝐴𝑃𝐼.'}`);
      }
    } catch (error) {
      console.error('API call failed:', error);
      await interaction.editReply('⚠️ 𝐘𝐮𝐫𝐢 𝐛𝐢̣ đ𝐢𝐞̂́𝐜:<< 𝐭𝐡𝐚𝐲 𝐀𝐏𝐈 đ𝐢 𝐥𝐚̀ 𝐡𝐞̂́𝐭 𝐛𝐞̣̂𝐧𝐡🛳️.');
    }
  },
};
