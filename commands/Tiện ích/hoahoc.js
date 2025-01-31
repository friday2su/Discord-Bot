const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

const API_URL = "https://api.popcat.xyz/periodic-table/random";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hoahoc')
        .setDescription('Hiển thị thông tin ngẫu nhiên về một nguyên tố trong bảng tuần hoàn'),
    async execute(interaction) {
        try {
            const response = await axios.get(API_URL);
            const element = response.data;
            
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`🔬 Nguyên tố: ${element.name} (${element.symbol})`)
                .setDescription(`**Số nguyên tử:** ${element.atomic_number}\n` +
                                `**Khối lượng nguyên tử:** ${element.atomic_mass}\n` +
                                `**Chu kỳ:** ${element.period}\n` +
                                `**Trạng thái:** ${element.phase}\n` +
                                `**Phát hiện bởi:** ${element.discovered_by}\n\n` +
                                `📖 **Tóm tắt:** ${element.summary}`)
                .setThumbnail(element.image);
            
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            return interaction.reply("⚠️ Không thể lấy thông tin nguyên tố. Vui lòng thử lại sau!");
        }
    }
};
