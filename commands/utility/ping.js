const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Displays the bot latency and API latency.'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const botLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('🏓 Pong!')
            .addFields(
                { name: 'Độ Trễ Bot🤖', value: `${botLatency}ms`, inline: true },
                { name: 'Đỗ trễ API🌐', value: `${apiLatency}ms`, inline: true },
            )
            .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
    },
};
