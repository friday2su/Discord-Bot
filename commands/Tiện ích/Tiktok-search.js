const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tiktok-search')
        .setDescription('Tìm kiếm video TikTok theo từ khóa!')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('Từ khóa bạn muốn tìm kiếm')
                .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query'); // Lấy từ khóa người dùng nhập
        const apiUrl = `https://zaikyoo.onrender.com/api/tiktok?query=${encodeURIComponent(query)}`; // URL API

        try {
            const response = await axios.get(apiUrl);
            const data = response.data;

            if (!data || !data.title || !data.no_watermark) {
                return interaction.reply({
                    content: '❌ Không tìm thấy video TikTok nào phù hợp với từ khóa của bạn.',
                    ephemeral: true // Chỉ người dùng thấy
                });
            }

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('🔍 Kết quả tìm kiếm trên TikTok')
                .setDescription(`==**Tiêu đề:**== ${data.title}`)
                .setImage(data.cover) // Ảnh bìa video
                .addFields(
                    { name: '📽️Tải không watermark💦', value: `[Tải video](<${data.no_watermark}>)`, inline: true },
                    { name: '📺Tải có watermark🚫💦', value: `[Tải video](<${data.watermark}>)`, inline: true },
                    { name: 'Âm nhạc🎶', value: `[Nghe nhạc](<${data.music}>)`, inline: true }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ Đã xảy ra lỗi khi kết nối với API hoặc không tìm thấy video.',
                ephemeral: true
            });
        }
    },
};
