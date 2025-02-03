const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkip')
    .setDescription('Kiểm tra thông tin IP')
    .addStringOption(option =>
      option.setName('ip')
        .setDescription('Địa chỉ IP cần kiểm tra')
        .setRequired(true)
    ),
  async execute(interaction) {
    const ip = interaction.options.getString('ip');

    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}?fields=66846719`);
      const infoip = response.data;

      const infoMessage = `
🌍 **Châu lục**: ${infoip.continent}
🏳 **Quốc gia**: ${infoip.country} (${infoip.countryCode})
🏛 **Khu vực**: ${infoip.region} - ${infoip.regionName}
🏙 **Thành phố**: ${infoip.city}
📍 **Quận/Huyện**: ${infoip.district}
📮 **Mã bưu điện**: ${infoip.zip}
🗺 **Vĩ độ**: ${infoip.lat}, **Kinh độ**: ${infoip.lon}
⏳ **Múi giờ**: ${infoip.timezone}
🏢 **Tổ chức**: ${infoip.org}
💰 **Đơn vị tiền tệ**: ${infoip.currency}
      `;

      await interaction.reply({ content: infoMessage });

    } catch (error) {
      console.error("Lỗi khi kiểm tra IP:", error);
      await interaction.reply({ content: "❌ Đã xảy ra lỗi khi kiểm tra IP.", ephemeral: true });
    }
  }
};
