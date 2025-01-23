const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rdgai')
        .setDescription('Gửi một video ngẫu nhiên!'),
    async execute(interaction) {
        // Danh sách video
        const videos = [
            'https://i.imgur.com/6H6Zrck.mp4',
            'https://i.imgur.com/NxFnFid.mp4',
            'https://i.imgur.com/1qw7u1r.mp4'
        ];

        // Lấy ngẫu nhiên một video từ danh sách
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        // Gửi video ngẫu nhiên
        await interaction.reply(randomVideo);
    },
};

