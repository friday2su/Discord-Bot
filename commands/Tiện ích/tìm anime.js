const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timanime')
        .setDescription('Tìm kiếm thông tin anime từ API MAL.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Tên anime cần tìm kiếm')
                .setRequired(true)),
    async execute(interaction) {
        const animeName = interaction.options.getString('name');
        const apiUrl = `https://zaikyoo.onrender.com/api/mal?title=${encodeURIComponent(animeName)}`;

        try {
            // Gọi API để lấy dữ liệu
            const response = await axios.get(apiUrl);
            const data = response.data;

            // Kiểm tra dữ liệu trả về từ API
            if (!data || !data.title) {
                return interaction.reply({
                    content: '❌ Không tìm thấy thông tin anime nào khớp với yêu cầu.',
                    ephemeral: true
                });
            }

            // Tạo Embed để hiển thị thông tin anime
            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(`📺 Anime: ${data.title}`)
                .setURL(data.url)
                .setDescription(data.description || 'Không có mô tả chi tiết.')
                .setThumbnail(data.picture)
                .addFields(
                    { name: 'Tên tiếng Nhật', value: data.japanese || 'N/A', inline: true },
                    { name: 'Loại hình', value: data.type || 'N/A', inline: true },
                    { name: 'Trạng thái', value: data.status || 'N/A', inline: true },
                    { name: 'Số tập', value: data.episodes || 'N/A', inline: true },
                    { name: 'Thời lượng', value: data.duration || 'N/A', inline: true },
                    { name: 'Thể loại', value: data.genres || 'N/A', inline: true },
                    { name: 'Điểm đánh giá', value: `${data.score} (${data.scoreStats})`, inline: true },
                    { name: 'Xếp hạng', value: `${data.ranked} (${data.popularity})`, inline: true },
                    { name: 'Ngày phát sóng', value: data.aired || 'N/A', inline: true },
                    { name: 'Nhà sản xuất', value: data.producers || 'N/A', inline: true }
                )
                .setFooter({ text: 'Thông tin từ MAL API', iconURL: 'https://cdn.myanimelist.net/images/faviconv5.ico' })
                .setTimestamp();

            // Gửi Embed kết quả
            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ Đã xảy ra lỗi khi gọi API hoặc không tìm thấy thông tin.',
                ephemeral: true
            });
        }
    },
};
