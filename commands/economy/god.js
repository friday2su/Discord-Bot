const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('god')
        .setDescription('Tạo ra một thảm họa ngẫu nhiên và xóa sổ ngẫu nhiên một số người trong server.'),
    async execute(interaction) {
        const guild = interaction.guild;

        // Lấy danh sách thành viên trong server
        const members = await guild.members.fetch();
        const memberList = members.filter(member => !member.user.bot).map(member => member);

        if (memberList.length === 0) {
            await interaction.reply('Không có thành viên nào để xóa sổ!');
            return;
        }

        // Tạo thảm họa ngẫu nhiên
        const disasters = [
            'Thiên thạch đâm vào server🌠',
            'Siêu bão hủy diệt🌪️',
            'Động đất mạnh cấp 10🌏',
            'Lũ quét bất ngờ⛈️',
            'Cháy rừng lan rộng🔥🎄'
        ];
        const disaster = disasters[Math.floor(Math.random() * disasters.length)];

        // Chọn ngẫu nhiên số người bị "xóa sổ"
        const numVictims = Math.floor(Math.random() * memberList.length) + 1;
        const victims = [];
        let totalMoneyLost = 0;

        for (let i = 0; i < numVictims; i++) {
            const randomIndex = Math.floor(Math.random() * memberList.length);
            const victim = memberList.splice(randomIndex, 1)[0];
            const moneyLost = Math.floor(Math.random() * 1000) + 100; // Số tiền ngẫu nhiên từ 100 đến 1000
            totalMoneyLost += moneyLost;

            victims.push({ name: victim.user.username, moneyLost });
        }

        // Tạo Embed để hiển thị kết quả
        const embed = new EmbedBuilder()
            .setTitle(`🌍 ${disaster}!`)
            .setColor('Red')
            .setDescription(`Thảm họa "${disaster}" đã xảy ra và gây thiệt hại lớn!`)
            .addFields(
                { name: 'Danh sách các nạn nhân', value: victims.map(v => `${v.name}: -${v.moneyLost} XC`).join('\n') || 'Không có nạn nhân.' },
                { name: 'Tổng thiệt hại', value: `${totalMoneyLost} XC` }
            )
            .setTimestamp();

        // Gửi kết quả thảm họa
        await interaction.reply({ embeds: [embed] });
    },
};
