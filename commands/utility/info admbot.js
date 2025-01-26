const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info-admin')
        .setDescription('Hiển thị thông tin cơ bản về admin.'),
    async execute(interaction) {
        // Nội dung thông tin
        const info = `
━━━━━『Xavia Discord』━━━━━
『✒️』→𝗡𝗮𝗺𝗲: 𝑳𝒂̂𝒎 𝑴𝒊𝒏𝒉 𝑺𝒐̛𝒏⚔️
『📋』→ 𝗔𝗴𝗲: 14+
『👥』→ 𝙎𝙚𝙭: 𝑵𝒂𝒎
『🎂』→ 𝗬𝗲𝗮𝗿 𝗢𝗳 𝗕𝗶𝗿𝘁𝗵: 05/10/2010
『💫』→ 𝗛𝗲𝗶𝗴𝗵𝘁 / 𝗪𝗲𝗶𝗴𝗵𝗲𝗱: 1m63/45
『💘』→𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽𝘀: 𝑳𝒐̛̀ 𝑴𝒐̛̀ 𝑺𝒐̛̀🦖
『🗺️』→𝗟𝗶𝘃𝗶𝗻𝗴 𝗶𝗻: 𝑯𝒂̀ 𝑵𝒐̣̂𝒊⛪
『🌐』→𝗖𝗼𝘂𝗻𝘁𝗿𝘆: 𝗩𝗶𝗲̣̂𝘁 𝗡𝗮𝗺
『🌪️』→𝙉𝙖𝙢𝙚 𝘽𝙤𝙩: 🕶️𝙔𝙪𝙧𝙞
https://i.imgur.com/6H6Zrck.mp4
👻━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🦄
`;

        // Gửi phản hồi
        await interaction.reply({
            content: info,
        });
    },
};

