const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000 % 60);
    const minutes = Math.floor(ms / (1000 * 60) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds) parts.push(`${seconds}s`);

    return parts.join(' ');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Displays the bot\'s uptime.'),
    async execute(interaction) {
        const uptime = formatDuration(interaction.client.uptime);

        const embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle('🕒 Bot Uptime')
            .setDescription(`I've been online for **${uptime}**.`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
