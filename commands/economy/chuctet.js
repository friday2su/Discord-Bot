const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chuctet')
        .setDescription('Gửi lời chúc Tết đến một người dùng trong server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('Người bạn muốn gửi lời chúc')
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const gifUrl = 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2V4NzltbGk3YWY5MWNjd2JuZHRiMThsd3J3dGx4cTNza2kxNGtqeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QCburoJ2rOBS3bs0uM/giphy.gif';
        
        // Tạo embed cho lời chúc Tết
        const embed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle('🎉 Chúc Mừng Năm Mới 🎊')
            .setDescription(`🎆 **Lời chúc từ ${interaction.user} dành cho ${user}!** 🎆\n✨ Chúc bạn năm mới an khang thịnh vượng, vạn sự như ý!`)
            .setImage(gifUrl)
            .setFooter({ text: 'Yuri chúc bé yêu 1 cái tết vui vẻ ạ!' });

        await interaction.reply({ content: `${user}`, embeds: [embed] });
    },
};
