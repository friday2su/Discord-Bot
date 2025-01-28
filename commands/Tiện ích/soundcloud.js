const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');

async function scl_download(url) {
    const res = await axios.get('https://soundcloudmp3.org/id');
    const $ = cheerio.load(res.data);
    const _token = $('form#conversionForm > input[type=hidden]').attr('value');

    const conver = await axios.post('https://soundcloudmp3.org/converter',
        new URLSearchParams(Object.entries({ _token, url })),
        {
            headers: { cookie: res.headers['set-cookie'], accept: 'UTF-8' },
        }
    );

    const $$ = cheerio.load(conver.data);
    return {
        thumb: $$('div.info.clearfix > img').attr('src'),
        title: $$('div.info.clearfix > p:nth-child(2)').text().replace('Title:', '').trim(),
        duration: $$('div.info.clearfix > p:nth-child(3)').text().replace(/Length:|Minutes/gi, '').trim(),
        quality: $$('div.info.clearfix > p:nth-child(4)').text().replace('Quality:', '').trim(),
        url: $$('a#download-btn').attr('href'),
    };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scl')
        .setDescription('Tìm kiếm nhạc trên SoundCloud')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Từ khóa tìm kiếm')
                .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const linkURL = `https://soundcloud.com`;
        const headers = {
            Accept: "application/json",
            "User-Agent": "Mozilla/5.0"
        };

        try {
            const response = await axios.get(`https://m.soundcloud.com/search?q=${encodeURIComponent(query)}`, { headers });
            const htmlContent = response.data;
            const $ = cheerio.load(htmlContent);
            const dataaa = [];

            $("div > ul > li > div").each((index, element) => {
                if (index < 5) {
                    const title = $(element).find("a").attr("aria-label")?.trim() || "";
                    const url = linkURL + ($(element).find("a").attr("href") || "").trim();
                    const artist = $(element).find("a > div > div > div").eq(1).text()?.trim() || "";

                    dataaa.push({ title, url, artist });
                }
            });

            if (dataaa.length === 0) {
                return interaction.reply(`❎ Không tìm thấy kết quả cho từ khóa "${query}"`);
            }

            const chosenItem = dataaa[0];
            const datadl = await scl_download(chosenItem.url);

            const audioPath = path.join(__dirname, `./${Date.now()}.mp3`);
            const audioBuffer = (await axios.get(datadl.url, { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(audioPath, Buffer.from(audioBuffer));

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('🎵 SoundCloud Track Info')
                .setDescription(`**Tên:** ${chosenItem.artist}\n**Tiêu đề:** ${chosenItem.title}\n**Chất lượng:** ${datadl.quality}`)
                .setTimestamp()
                .setFooter({ text: moment().tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY || HH:mm:ss') });

            const audioFile = new AttachmentBuilder(audioPath, { name: 'track.mp3' });

            await interaction.reply({ embeds: [embed], files: [audioFile] });

            // Xóa file sau khi gửi
            setTimeout(() => fs.unlinkSync(audioPath), 2 * 60 * 1000);
        } catch (error) {
            console.error("❎ Lỗi khi tìm kiếm hoặc phát nhạc:", error);
            interaction.reply(`❎ Đã xảy ra lỗi khi tìm kiếm hoặc phát nhạc`);
        }
    }
};
