const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs-extra');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('4k')
    .setDescription('Tải ảnh từ link hoặc reply ảnh.')
    .addStringOption(option =>
      option.setName('link')
        .setDescription('Link ảnh hoặc reply ảnh.')),
  async execute(interaction) {
    const linkUp = interaction.options.getString('link') || (interaction.message.reference ? interaction.message.reference.message.attachments[0].url : '');

    if (!linkUp) {
      return interaction.reply({ content: 'Vui lòng reply 1 ảnh hoặc nhập link ảnh!', ephemeral: true });
    }

    try {
      // Tải ảnh từ liên kết
      const response = await axios.get(linkUp, { responseType: "arraybuffer" });
      const filePath = `./cache/netanh.png`;

      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      // Trả về ảnh
      await interaction.reply({ content: '🧸 Ảnh của bạn đây!', files: [filePath] });

      // Xóa file sau khi gửi
      fs.unlinkSync(filePath);

    } catch (error) {
      return interaction.reply({ content: "Có lỗi xảy ra: " + error.message, ephemeral: true });
    }
  }
};
