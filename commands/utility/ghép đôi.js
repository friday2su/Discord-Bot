const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

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

        // Nếu không chọn người dùng, ghép đôi ngẫu nhiên
        if (!targetUser) {
            const members = await guild.members.fetch();
            const participants = members.filter(member => !member.user.bot && member.id !== interaction.user.id).map(member => member);

            if (participants.length === 0) {
                await interaction.reply('Không có thành viên nào để ghép đôi trong kênh này!');
                return;
            }

            const randomMember = participants[Math.floor(Math.random() * participants.length)];
            const compatibility = Math.floor(Math.random() * 101);

            await interaction.reply(`💘 **Ghép đôi thành công!**  
            『 **${interaction.user.username}** 』 💘 『 **${randomMember.user.username}** 』  
            **Mức độ hiểu nhau:** ${compatibility}%`);
        } else {
            // Nếu người dùng chọn ai đó, ghép đôi với họ
            if (targetUser.bot) {
                await interaction.reply('Bạn không thể ghép đôi với bot!');
                return;
            }

            if (targetUser.id === interaction.user.id) {
                await interaction.reply('Bạn không thể ghép đôi với chính mình!');
                return;
            }

            const compatibility = Math.floor(Math.random() * 101);

            await interaction.reply(`💘 **Ghép đôi thành công!**  
            『 **${interaction.user.username}** 』 💘 『 **${targetUser.username}** 』  
            **Mức độ hiểu nhau:** ${compatibility}%`);
        }
    },
};
