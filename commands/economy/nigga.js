const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nigga')
        .setDescription('Chọn công việc cho thằng Hùng Công Nông.'),
    async execute(interaction) {
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

        await interaction.reply({
            content: 'Hãy chọn công việc mà bạn muốn cho nô lệ Hùng thực hiện:',
            components: [buttons]
        });

        const filter = (i) => i.user.id === interaction.user.id; 
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (buttonInteraction) => {
            let reward;
            let workDescription;

            if (buttonInteraction.customId === 'farm') {
                reward = Math.floor(Math.random() * 51) + 50; // 50-100 XC
                workDescription = 'Thằng Hùng đã cày 100 thửa ruộng!';
            } else if (buttonInteraction.customId === 'mine') {
                reward = Math.floor(Math.random() * 101) + 100; // 100-200 XC
                workDescription = 'Thằng Hùng đã đào được 2 viên kim cương💎✅!';
            } else if (buttonInteraction.customId === 'hunt') {
                reward = Math.floor(Math.random() * 151) + 200; // 200-350 XC
                workDescription = 'Thằng Hùng đã bị lợn rừng kill chết🪦✅!';
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

