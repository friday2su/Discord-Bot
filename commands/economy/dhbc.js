const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dhbc')
        .setDescription('Trò chơi Đuổi Hình Bắt Chữ bằng emoji'),
    async execute(interaction) {
        try {
            // Gọi API lấy câu hỏi từ Đuổi Hình Bắt Chữ
            const response = await axios.get('https://subhatde.id.vn/game/dhbcv3');
            const questionData = response.data;

            if (!questionData || !questionData.emojis || !questionData.answer) {
                return interaction.reply('⚠️ Không tìm thấy dữ liệu trò chơi. Vui lòng thử lại sau.');
            }

            const emojis = questionData.emojis.join(' ');
            const answer = questionData.answer;

            // Tạo Embed cho câu hỏi
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('🎮 Đuổi Hình Bắt Chữ 🎭')
                .setDescription(`Hãy đoán từ dựa vào các emoji sau:\n${emojis}`)
                .setFooter({ text: 'Gõ câu trả lời của bạn trong vòng 30 giây!' });

            await interaction.reply({ embeds: [embed] });

            // Chờ câu trả lời từ người dùng
            const filter = (msg) => msg.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

            collector.on('collect', (msg) => {
                if (msg.content.toLowerCase() === answer.toLowerCase()) {
                    msg.reply(`🎉 Chính xác! Đáp án là **${answer}**.`);
                    collector.stop();
                } else {
                    msg.reply('❌ Sai rồi, thử lại nào!');
                }
            });

            collector.on('end', (collected) => {
                if (collected.size === 0) {
                    interaction.followUp(`⏰ Hết giờ! Đáp án đúng là **${answer}**.`);
                }
            });
        } catch (error) {
            console.error('❎ Lỗi khi gọi API:', error);
            interaction.reply('⚠️ Đã xảy ra lỗi khi lấy dữ liệu từ API. Vui lòng thử lại sau.');
        }
    }
};
