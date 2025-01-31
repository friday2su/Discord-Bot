const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('covid')
        .setDescription('Xem con chó COVID-19 đã làm gì')
        .addStringOption(option => 
            option.setName('quocgia')
                .setDescription('Tên quốc gia')
                .setRequired(true)
        ),
    async execute(interaction) {
        const country = interaction.options.getString('quocgia');

        try {
            const res = await axios.get(`https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}`);
            const data = res.data;
            
            const message = `\n🌎 **Quốc gia**: ${data.country}\n` +
                            `🦠 **Nhiễm**: ${data.cases.toLocaleString()}\n` +
                            `☠️ **Tử vong**: ${data.deaths.toLocaleString()}\n` +
                            `❤️ **Chữa trị**: ${data.recovered.toLocaleString()}\n` +
                            `📝 **Dân số**: ${data.population.toLocaleString()}\n` +
                            `🔎 **Châu lục**: ${data.continent}`;
            
            await interaction.reply({ content: message, ephemeral: false });
        } catch (error) {
            await interaction.reply({ content: 'Không tìm thấy thông tin quốc gia hoặc có lỗi xảy ra.', ephemeral: true });
        }
    }
};
