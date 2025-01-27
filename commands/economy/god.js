const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('god')
        .setDescription('Tạo ra một thảm họa và xóa sổ ngẫu nhiên một số thành viên trong server.'),
    async execute(interaction) {
        const guild = interaction.guild;

        // Lấy danh sách thành viên không phải bot trong server
        const members = await guild.members.fetch();
        const memberList = members.filter(member => !member.user.bot).map(member => member);

        if (memberList.length === 0) {
            await interaction.reply('Không có thành viên nào để "xóa sổ" trong server!');
            return;
        }

        // Tạo thảm họa ngẫu nhiên
        const disasters = [
            'Thiên thạch đâm vào server',
            'Siêu bão hủy diệt',
            'Động đất mạnh cấp 10',
            'Lũ quét bất ngờ',
            'Cháy rừng lan rộng'
        ];
        const disaster = disasters[Math.floor(Math.random() * disasters.length)];

        // Gửi thông báo thảm họa
        await interaction.reply(`🌍 **${disaster}** vừa xảy ra! Nhiều thành viên đã bị ảnh hưởng...`);

        // Chọn ngẫu nhiên các nạn nhân
        const numVictims = Math.floor(Math.random() * memberList.length) + 1;
        const victims = [];
        let totalMoneyLost = 0;

        for (let i = 0; i < numVictims; i++) {
            const randomIndex = Math.floor(Math.random() * memberList.length);
            const victim = memberList.splice(randomIndex, 1)[0];
            const moneyLost = Math.floor(Math.random() * 1000) + 100; // Số tiền mất từ 100 đến 1000
            totalMoneyLost += moneyLost;

            victims.push({ name: victim.user.username, moneyLost });
        }

        // Tạo danh sách nạn nhân và tổng thiệt hại
        const victimList = victims.map(v => `- **${v.name}**: -${v.moneyLost} XC`).join('\n') || 'Không có nạn nhân.';
        const resultMessage = `💔 **Danh sách nạn nhân bị ảnh hưởng:**\n${victimList}\n\n📉 **Tổng thiệt hại:** ${totalMoneyLost} XC`;

        // Gửi danh sách nạn nhân và tổng thiệt hại
        await interaction.followUp(resultMessage);
    },
};
