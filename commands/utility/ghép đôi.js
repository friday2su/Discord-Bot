const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { join } = require('path');
const axios = require('axios');
const fs = require('fs');

const lovePath = join(__dirname, 'love_pairing.png');
const loveIconUrl = 'https://i.ibb.co/2g0wdVV/heart-icon-14.png';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ghepdoi')
        .setDescription('Ghép đôi ngẫu nhiên giữa các thành viên trong kênh'),
    async execute(interaction) {
        try {
            // Đảm bảo tệp ảnh trái tim được tải xuống
            if (!fs.existsSync(lovePath)) {
                const response = await axios.get(loveIconUrl, { responseType: 'arraybuffer' });
                fs.writeFileSync(lovePath, response.data);
            }

            // Lấy danh sách thành viên trong kênh hiện tại
            const channel = interaction.channel;
            const members = await channel.members.fetch();
            const participants = members.filter(member => !member.user.bot && member.id !== interaction.user.id).map(member => member);

            if (participants.length === 0) {
                await interaction.reply('Không có thành viên nào để ghép đôi trong kênh này!');
                return;
            }

            // Chọn ngẫu nhiên một người để ghép đôi
            const targetMember = participants[Math.floor(Math.random() * participants.length)];
            const user1 = interaction.user; // Người gọi lệnh
            const user2 = targetMember.user; // Người được ghép đôi

            // Tính mức độ hiểu nhau
            const compatibility = Math.floor(Math.random() * 101);

            // Tải avatar của hai người
            const avatar1Path = join(__dirname, `${user1.id}.png`);
            const avatar2Path = join(__dirname, `${user2.id}.png`);

            const avatar1 = await axios.get(user1.displayAvatarURL({ format: 'png', size: 512 }), { responseType: 'arraybuffer' });
            const avatar2 = await axios.get(user2.displayAvatarURL({ format: 'png', size: 512 }), { responseType: 'arraybuffer' });

            fs.writeFileSync(avatar1Path, avatar1.data);
            fs.writeFileSync(avatar2Path, avatar2.data);

            // Tạo tin nhắn kết quả
            const embed = new EmbedBuilder()
                .setTitle('💘 Ghép Đôi Thành Công! 💘')
                .setColor('Red')
                .setDescription(`👑 Yuri xin chúc 2 anh chị trăm năm hạnh phúc!  
                **Mức Độ Hiểu Nhau**: ${compatibility}%  
                『 **${user1.username}** 』 💘 『 **${user2.username}** 』`)
                .setThumbnail('attachment://love_pairing.png')
                .setTimestamp();

            const attachment1 = new AttachmentBuilder(avatar1Path, { name: `${user1.id}.png` });
            const attachment2 = new AttachmentBuilder(avatar2Path, { name: `${user2.id}.png` });
            const attachmentLove = new AttachmentBuilder(lovePath, { name: 'love_pairing.png' });

            // Gửi tin nhắn
            await interaction.reply({
                embeds: [embed],
                files: [attachment1, attachmentLove, attachment2],
            });

            // Xóa file tạm
            fs.unlinkSync(avatar1Path);
            fs.unlinkSync(avatar2Path);

        } catch (error) {
            console.error(error);
            await interaction.reply('Đã xảy ra lỗi khi thực hiện lệnh.');
        }
    },
};

