const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info-admin')
        .setDescription('Hiển thị thông tin cơ bản về admin.'),
    async execute(interaction) {
        // Tạo Embed chứa thông tin admin
        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Thông tin Admin 🛡️')
            .setDescription(`
━━━━━━━━━『Xavia Discord』━━━━━━━━━━
『✒️』**𝗡𝗮𝗺𝗲:** 𝑳𝒂̂𝒎 𝑴𝒊𝒏𝒉 𝑺𝒐̛𝒏⚔️  
『📋』**𝗔𝗴𝗲:** 14+  
『👥』**𝙎𝙚𝙭:** 𝑵𝒂𝒎  
『🎂』**𝗬𝗲𝗮𝗿 𝗢𝗳 𝗕𝗶𝗿𝘁𝗵:** 05/10/2010  
『💫』**𝗛𝗲𝗶𝗴𝗵𝘁 / 𝗪𝗲𝗶𝗴𝗵𝘁:** 1m63 / 45kg  
『💘』**𝗥𝗲𝗹𝗮𝘁𝗶𝗼𝗻𝘀𝗵𝗶𝗽𝘀:** 𝑳𝒐̛̀ 𝑴𝒐̛̀ 𝑺𝒐̛̀🦖  
『🗺️』**𝗟𝗶𝘃𝗶𝗻𝗴 𝗶𝗻:** 𝑯𝒂̀ 𝑵𝒐̣̂𝒊⛪  
『🌐』**𝗖𝗼𝘂𝗻𝘁𝗿𝘆:** 𝗩𝗶𝗲̣̂𝘁 𝗡𝗮𝗺  
『🌪️』**𝙉𝙖𝙢𝙚 𝘽𝙤𝙩:** 𝙔𝙪𝙧𝙞⛏️  
『💝』**𝗤𝘂𝗮𝗻 𝗵𝗲̣̂:** 𝗗𝗮̃ 𝗖𝗼́ 𝗚𝗵𝗲̣̂  
『🛜』**𝗖𝗼𝗻𝘁𝗮𝗰𝘁 𝗠𝗲:** [𝗟𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸](https://www.facebook.com/lms.cutii)  
            `)
            .setImage('https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnZ0anhheHBuZHFoeHRjb3FycHU4cmN4c3d4aDl3dWNybHhwb3doeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/96GnoTw2B0v00jYdat/giphy.gif')
            .setTimestamp()
            .setFooter({ text: 'Thông tin chi tiết về admin!', iconURL: 'https://cdn-icons-png.flaticon.com/512/1973/1973685.png' });

        // Gửi phản hồi bằng Embed
        await interaction.reply({
            embeds: [embed],
        });
    },
};

