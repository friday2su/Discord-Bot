const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nigga')
        .setDescription('Chọn công việc cho nhân vật "abc".'),
    async execute(interaction) {
        // Tạo nút cho các công việc
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('farm')
                .setLabel('Làm ruộng 🌾')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('mine')
                .setLabel('Đào quặng ⛏️')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('hunt')
                .setLabel('Săn bắn 🦌')
                .setStyle(ButtonStyle.Danger)
        );

        // Gửi thông báo cho người dùng với các nút
        await interaction.reply({
            content: 'Hãy chọn công việc mà bạn muốn nhân vật "abc" thực hiện:',
            components: [buttons]
        });

        // Chờ người dùng bấm nút
        const filter = (i) => i.user.id === interaction.user.id; // Chỉ nhận tương tác từ người đã gửi lệnh
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (buttonInteraction) => {
            let reward;
            let workDescription;

            // Xử lý công việc dựa trên nút được bấm
            if (buttonInteraction.customId === 'farm') {
                reward = Math.floor(Math.random() * 51) + 50; // 50-100 XC
                workDescription = 'Nhân vật "abc" đã hoàn thành công việc làm ruộng!';
            } else if (buttonInteraction.customId === 'mine') {
                reward = Math.floor(Math.random() * 101) + 100; // 100-200 XC
                workDescription = 'Nhân vật "abc" đã hoàn thành công việc đào quặng!';
            } else if (buttonInteraction.customId === 'hunt') {
                reward = Math.floor(Math.random() * 151) + 200; // 200-350 XC
                workDescription = 'Nhân vật "abc" đã hoàn thành công việc săn bắn!';
            }

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('🎉 Công việc hoàn thành!')
                .setDescription(workDescription)
                .addFields({ name: 'Phần thưởng', value: `${reward} XC` });

            await buttonInteraction.update({
                content: 'Công việc đã được xử lý!',
                embeds: [embed],
                components: [] // Xóa nút sau khi xử lý
            });
        });

        collector.on('end', async (collected) => {
            if (collected.size === 0) {
                await interaction.editReply({
                    content: 'Bạn không chọn công việc nào! Hãy thử lại.',
                    components: []
                });
            }
        });
    }
};

