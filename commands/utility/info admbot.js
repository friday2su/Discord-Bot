const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('infoadmbot')
        .setDescription('Thông Tin adm.'),
    async execute(interaction) {
        // Thông tin cơ bản
        const botName = '𝙔𝙪𝙧𝙞🪼';
        const ownerName = '🐲𝙇𝙖̂𝙢 𝙈𝙞𝙣𝙝 𝙎𝙤̛𝙣🌐';
        const age = 14; 
        const hometown = 'Hà Nội⛪';
        const birthYear = 2010🎂;
        const prefix = '/'; // Dấu lệnh
        const adminCount = 3;

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Thông tin về bot và admin')
            .addFields(
                { name: '『Tên bot』→', value: botName, inline: true },
                { name: '『Admin chính』→', value: ownerName, inline: true },
                { name: '『Tuổi』→', value: `${age}`, inline: true },
                { name: '『Quê quán』→', value: hometown, inline: true },
                { name: '『Năm sinh』→', value: `${birthYear}`, inline: true },
                { name: '『Dấu lệnh』→', value: prefix, inline: true },
                { name: '『Số lượng admin:ghost:』→', value: `${adminCount}`, inline: true }
            )
            .setFooter({ text: 'Thông tin được cung cấp bởi bot của bạn.' })
            .setTimestamp();

        const video = new AttachmentBuilder('https://files.catbox.moe/3ea1oy.mp4', {
            name: 'info-video.mp4',
        });

        await interaction.reply({
            content: 'Dưới đây là thông tin về admin và bot:',
            embeds: [embed],
            files: [video],
        });
    },
};
