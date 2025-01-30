const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

const cachePath = './cache';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enhance-image')
        .setDescription('Tăng độ phân giải hình ảnh khi reply tin nhắn có hình ảnh.'),
    async execute(interaction) {
        await interaction.reply('📸 Vui lòng reply vào tin nhắn có hình ảnh để nâng cao chất lượng và nhập **OK**.');
        const filter = (msg) => msg.author.id === interaction.user.id && msg.content.toLowerCase() === 'ok';

        const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

        collector.on('collect', async (msg) => {
            if (!msg.reference) {
                await msg.reply('⚠️ Bạn chưa reply vào tin nhắn có hình ảnh.');
                return;
            }

            const referencedMessage = await msg.channel.messages.fetch(msg.reference.messageId);
            const attachment = referencedMessage.attachments.first();

            if (!attachment || !attachment.contentType.startsWith('image/')) {
                await msg.reply('❌ Tin nhắn bạn reply không chứa hình ảnh.');
                return;
            }

            try {
                // Gọi API để tăng độ phân giải
                const response = await axios.get(`https://4k-ayoub.vercel.app/upscale?url=${encodeURIComponent(attachment.url)}`, {
                    responseType: 'arraybuffer',
                });

                if (response.status !== 200) {
                    await msg.reply('❌ Đã xảy ra lỗi khi xử lý hình ảnh.');
                    return;
                }

                // Đảm bảo thư mục cache tồn tại
                await fs.ensureDir(cachePath);

                // Lưu ảnh kết quả vào file tạm
                const filePath = path.join(cachePath, `${Date.now()}-4k.png`);
                await fs.outputFile(filePath, response.data);

                // Gửi lại ảnh đã nâng cao độ phân giải cho người dùng
                const enhancedImage = new AttachmentBuilder(filePath, { name: 'enhanced-image.png' });
                await msg.reply({ content: '✅ Hình ảnh đã được nâng cao chất lượng!', files: [enhancedImage] });

                // Xóa file tạm sau khi gửi
                setTimeout(() => fs.unlinkSync(filePath), 60000); // Xóa sau 1 phút
            } catch (error) {
                console.error(error);
                await msg.reply('❌ Đã xảy ra lỗi khi thực thi lệnh.');
            }

            collector.stop();
        });

        collector.on('end', async (_, reason) => {
            if (reason === 'time') {
                await interaction.followUp('⏰ Hết thời gian chờ. Vui lòng thử lại.');
            }
        });
    },
};

