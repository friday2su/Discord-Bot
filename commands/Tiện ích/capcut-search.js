const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('capcut-search')
        .setDescription('Tìm kiếm mẫu CapCut theo từ khóa.')
        .addStringOption(option =>
            option.setName('keyword')
                .setDescription('Từ khóa tìm kiếm mẫu CapCut')
                .setRequired(true)
        ),
    async execute(interaction) {
        const keyword = interaction.options.getString('keyword');
        const apiUrl = `https://subhatde.id.vn/capcut/search?keyword=${encodeURIComponent(keyword)}`;

        try {
            const response = await axios.get(apiUrl);
            const templates = response.data;

            if (!templates || templates.length === 0) {
                return interaction.reply(`❎ Không tìm thấy mẫu nào với từ khóa: "${keyword}"`);
            }

            // Tạo embed hiển thị kết quả
            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(`🔍 Kết quả tìm kiếm cho: "${keyword}"`)
                .setFooter({ text: 'Dữ liệu từ API Subhatde' });

            // Hiển thị tối đa 5 mẫu
            templates.slice(0, 5).forEach((template, index) => {
                embed.addFields({
                    name: `Mẫu #${index + 1}`,
                    value: `**Tiêu đề:** ${template.title}\n🔗 [Xem video](${template.video_url})\n👍 Lượt thích: ${template.like_count}\n💬 Bình luận: ${template.comment_count}\n🕒 Thời lượng: ${(template.duration / 1000).toFixed(2)} giây`,
                });
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('❎ Lỗi khi gọi API:', error);
            interaction.reply(`❎ Có lỗi xảy ra khi tìm kiếm mẫu CapCut. Vui lòng thử lại sau.`);
        }
    },
};
// npm install discord.js axios nếu mày cần
