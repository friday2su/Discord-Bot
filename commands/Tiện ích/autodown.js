require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let autoDownload = true; // Trạng thái bật/tắt tự động tải

const getPlatformName = (url) => {
    const platforms = {
        tiktok: /https:\/\/(vm|www|vt)\.tiktok\.com\//,
        youtube: /https:\/\/www\.youtube\.com\//,
        facebook: /https:\/\/www\.facebook\.com\//,
        instagram: /https:\/\/www\.instagram\.com\//
    };
    
    for (let [platform, regex] of Object.entries(platforms)) {
        if (regex.test(url)) {
            return platform.toUpperCase();
        }
    }
    return "UNKNOWN";
};

const downloadMedia = async (mediaData) => {
    let attachments = [];
    for (let media of mediaData.medias) {
        if (media.url) {
            try {
                let res = await axios.get(media.url, { responseType: 'arraybuffer' });
                let filePath = path.join(__dirname, 'downloads', `${Date.now()}.${media.extension || 'mp4'}`);
                fs.writeFileSync(filePath, res.data);
                attachments.push(filePath);
            } catch (error) {
                console.error("Lỗi khi tải media:", error);
            }
        }
    }
    return attachments;
};

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    if (message.content.startsWith('!autodown on')) {
        autoDownload = true;
        return message.reply("✅ Chế độ tự động tải đã được **bật**.");
    }
    
    if (message.content.startsWith('!autodown off')) {
        autoDownload = false;
        return message.reply("❌ Chế độ tự động tải đã được **tắt**.");
    }
    
    if (!autoDownload) return;
    
    let urls = message.content.match(/https?:\/\/[^\s]+/g);
    if (!urls) return;
    
    let mediaUrl = urls[0];
    let platform = getPlatformName(mediaUrl);
    
    try {
        let res = await axios.get(`https://kyphandev.site/down/allj2?link=${encodeURIComponent(mediaUrl)}&apikey=test`);
        if (!res.data || !res.data.medias) return message.reply("Không tìm thấy phương tiện nào để tải xuống.");
        
        let attachments = await downloadMedia(res.data);
        for (let filePath of attachments) {
            await message.channel.send({ files: [filePath] });
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        message.reply("❌ Lỗi khi tải xuống phương tiện.");
    }
});

client.login(process.env.TOKEN);
