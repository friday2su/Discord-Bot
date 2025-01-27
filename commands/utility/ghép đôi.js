const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const { join } = require('path');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ghepdoi')
        .setDescription('Ghép đôi ngẫu nhiên hoặc với người bạn chọn.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Người bạn muốn ghép đôi')
                .setRequired(false)
        ),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const guild = interaction.guild;

        try {
            const user1 = interaction.user; // Người gọi lệnh
            let user2; // Người được ghép đôi
            const compatibility = Math.floor(Math.random() * 101); // Mức độ hiểu nhau

            // Nếu không chọn người, ghép đôi ngẫu nhiên
            if (!targetUser) {
                const members = await guild.members.fetch();
                const participants = members.filter(member => !member.user.bot && member.id !== user1.id).map(member => member);

                if (participants.length === 0) {
                    await interaction.reply('Không có thành viên nào để ghép đôi trong kênh này!');
                    return;
                }

                user2 = participants[Math.floor(Math.random() * participants.length)].user;
            } else {
                if (targetUser.bot) {
                    await interaction.reply('Bạn không thể ghép đôi với bot!');
                    return;
                }
                if (targetUser.id === user1.id) {
                    await interaction.reply('Bạn không thể ghép đôi với chính mình!');
                    return;
                }
                user2 = targetUser;
            }

            // Tải avatar của hai người
            const avatar1Path = join(__dirname, `${user1.id}.png`);
            const avatar2Path = join(__dirname, `${user2.id}.png`);

            const avatar1 = await axios.get(user1.displayAvatarURL({ format: 'png', size: 512 }), { responseType: 'arraybuffer' });
            const avatar2 = await axios.get(user2.displayAvatarURL({ format: 'png', size: 512 }), { responseType: 'arraybuffer' });

            fs.writeFileSync(avatar1Path, avatar1.data);
            fs.writeFileSync(avatar2Path, avatar2.data);

            // Tạo Embed với avatar
            const embed = new EmbedBuilder()
                .setTitle('💘 Ghép Đôi Thành Công! 💘')
                .setColor('Red')
                .setDescription(`👑 Yuri xin chúc 2 anh chị trăm năm hạnh phúc!  
                **Mức độ hiểu nhau:** ${compatibility}%  
                『 **${user1.username}** 』 💘 『 **${user2.username}** 』`)
                .setImage('attachment://love_pairing.png')
                .setTimestamp();

            const attachment1 = new AttachmentBuilder(avatar1Path, { name: `${user1.id}.png` });
            const attachment2 = new AttachmentBuilder(avatar2Path, { name: `${user2.id}.png` });

            // Gửi tin nhắn với avatar và embed
            await interaction.reply({
                embeds: [embed],
                files: [attachment1, attachment2],
            });

            // Xóa file avatar tạm
            fs.unlinkSync(avatar1Path);
            fs.unlinkSync(avatar2Path);
        } catch (error) {
            console.error(error);
            await interaction.reply('Đã xảy ra lỗi khi thực hiện lệnh ghép đôi!');
        }
    },
};
