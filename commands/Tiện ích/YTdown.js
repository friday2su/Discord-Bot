const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('YTdownload')
    .setDescription('Tải nhạc hoặc video từ YouTube')
    .addStringOption(option => 
      option.setName('url')
        .setDescription('Liên kết YouTube bạn muốn tải')
        .setRequired(true)
    ),
  async execute(interaction) {
    const videoUrl = interaction.options.getString('url');
    
    if (!ytdl.validateURL(videoUrl)) {
      return interaction.reply({ content: '❌ Vui lòng cung cấp một liên kết YouTube hợp lệ!', ephemeral: true });
    }

    const videoID = ytdl.getURLVideoID(videoUrl);
    const filePath = path.join(__dirname, 'cache', `${videoID}.mp4`);

    await interaction.reply('🔄 Đang tải video, vui lòng chờ...');

    try {
      const stream = ytdl(videoUrl, { filter: 'audioandvideo', quality: '18' });
      const writeStream = fs.createWriteStream(filePath);

      stream.pipe(writeStream);

      writeStream.on('finish', async () => {
        await interaction.editReply({ content: '✅ Video đã tải xong!', files: [filePath] });

        // Xóa file sau khi gửi
        setTimeout(() => fs.unlinkSync(filePath), 1000 * 60);
      });

      writeStream.on('error', (err) => {
        console.error(err);
        interaction.editReply({ content: '❌ Có lỗi xảy ra khi tải video.' });
      });

    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: '❌ Không thể tải video.' });
    }
  }
};
