const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cunghoangdao')
    .setDescription('Kiểm tra cung hoàng đạo dựa theo ngày, tháng, năm sinh.')
    .addIntegerOption(option =>
      option.setName('ngay')
        .setDescription('Ngày sinh của bạn')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('thang')
        .setDescription('Tháng sinh của bạn')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('nam')
        .setDescription('Năm sinh của bạn')
        .setRequired(true)),

  async execute(interaction) {
    const day = interaction.options.getInteger('ngay');
    const month = interaction.options.getInteger('thang');
    const year = interaction.options.getInteger('nam');

    // Kiểm tra ngày tháng hợp lệ
    if (!isValidDate(day, month, year)) {
      await interaction.reply('Ngày tháng năm sinh không hợp lệ. Vui lòng nhập lại.');
      return;
    }

    try {
      // Gọi API để lấy thông tin cung hoàng đạo
      const response = await axios.get('https://nguyenmanh.name.vn/api/cunghoangdao', {
        params: {
          ngay: day,
          thang: month,
        }
      });

      const zodiacData = response.data;
      if (zodiacData && zodiacData.result && zodiacData.result.length > 0) {
        const zodiacInfo = zodiacData.result[0];
        await interaction.reply({
          content: `♈️ **Cung Hoàng Đạo:** ${zodiacInfo.maket}
🔮 **Thông tin:** ${zodiacInfo.maket}
📸 [Hình ảnh minh họa](${zodiacInfo.image})`,
          ephemeral: true
        });
      } else {
        await interaction.reply('Không tìm thấy thông tin cung hoàng đạo của bạn. Vui lòng thử lại sau.');
      }

    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      await interaction.reply('Đã xảy ra lỗi khi lấy thông tin cung hoàng đạo.');
    }
  }
};

function isValidDate(day, month, year) {
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
}
