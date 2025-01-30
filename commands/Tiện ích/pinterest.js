const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pinterest')
        .setDescription('Tìm kiếm hình ảnh trên Pinterest.')
        .addStringOption(option =>
            option.setName('keyword')
                .setDescription('Từ khóa tìm kiếm')
                .setRequired(true)
        ),
    async execute(interaction) {
        const keyword = interaction.options.getString('keyword');
        const apiUrl = `https://subhatde.id.vn/pinterest?search=${encodeURIComponent(keyword)}`;

        try {
            const response = await axios.get(apiUrl);
            const data = response.data?.data;

            if (!data || data.length === 0) {
                return interaction.reply(`❎ Không tìm thấy hình ảnh nào cho từ khóa: **${keyword}**`);
            }

            const randomImageUrl = data[Math.floor(Math.random() * data.length)];

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle(`🔍 Kết quả tìm kiếm Pinterest cho: "${keyword}"`)
                .setImage(randomImageUrl)
                .setFooter({ text: 'Nguồn: Pinterest' });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(':negative_squared_cross_mark: Lỗi API :', error);
            interaction.reply(':warning: Đã xảy ra lỗi khi tìm kiếm hình ảnh. Vui lòng thử lại sau.');
        }
    },
};
//npm install discord.js axios
