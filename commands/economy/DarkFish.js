const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const dataPath = path.join(__dirname, 'game', 'cauca', 'datauser');
const itemPath = path.join(__dirname, 'game', 'cauca', 'item.json');

async function ensureDirectoryStructure() {
    if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('subnautica')
        .setDescription('Trò chơi câu cá Dark Fish đầy thú vị!')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('Nhập lệnh: register, shop, bag, fish')
                .setRequired(true)
        ),
    async execute(interaction) {
        const command = interaction.options.getString('command');
        const userId = interaction.user.id;

        await ensureDirectoryStructure();

        const userFilePath = path.join(dataPath, `${userId}.json`);

        switch (command) {
            case 'register': {
                if (fs.existsSync(userFilePath)) {
                    return interaction.reply('⚠️ Bạn đã đăng ký khu vực câu cá rồi!');
                }

                const initialData = {
                    name: interaction.user.username,
                    mainRod: null,
                    GPS: { locate: null, area: null },
                    fishBag: [],
                    item: [],
                    timeRegister: new Date().toLocaleString(),
                };

                fs.writeFileSync(userFilePath, JSON.stringify(initialData, null, 4));

                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('🦈 Subnautica')
                    .setDescription('⚓ Đăng ký khu vực câu cá thành công! Chúc bạn câu cá vui vẻ 🎣');
                return interaction.reply({ embeds: [embed] });
            }

            case 'shop': {
                if (!fs.existsSync(userFilePath)) {
                    return interaction.reply('⚠️ Bạn chưa đăng ký khu vực câu cá. Hãy dùng lệnh `/subnautica command:register` để bắt đầu.');
                }

                const items = JSON.parse(fs.readFileSync(itemPath));
                const itemList = items.map((item, index) => `🎣 **${index + 1}. ${item.name}** - ${item.price}$`).join('\n');

                const embed = new EmbedBuilder()
                    .setColor('Gold')
                    .setTitle('🎣 Fishing Shop')
                    .setDescription(itemList)
                    .setFooter({ text: 'Reply tin nhắn này với số thứ tự vật phẩm để mua.' });

                return interaction.reply({ embeds: [embed] });
            }

            case 'bag': {
                if (!fs.existsSync(userFilePath)) {
                    return interaction.reply('⚠️ Bạn chưa đăng ký khu vực câu cá.');
                }

                const userData = JSON.parse(fs.readFileSync(userFilePath));
                const fishList = userData.fishBag.map(
                    (fish, index) => `🐟 **${index + 1}. ${fish.name}** - Size: ${fish.size}cm, Giá bán: ${fish.sell}$`
                ).join('\n') || '🔴 Túi của bạn hiện trống.';

                const embed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle('🎒 Túi đồ của bạn')
                    .setDescription(fishList);

                return interaction.reply({ embeds: [embed] });
            }

            case 'fish': {
                if (!fs.existsSync(userFilePath)) {
                    return interaction.reply('⚠️ Bạn chưa đăng ký khu vực câu cá.');
                }

                const fishTypes = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical'];
                const randomFishType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
                const randomSize = Math.floor(Math.random() * 100) + 1;
                const randomPrice = Math.floor(Math.random() * 500) + 50;

                const newFish = {
                    name: `${randomFishType} Fish`,
                    category: randomFishType,
                    size: randomSize,
                    sell: randomPrice,
                };

                const userData = JSON.parse(fs.readFileSync(userFilePath));
                userData.fishBag.push(newFish);
                fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 4));

                const embed = new EmbedBuilder()
                    .setColor('Aqua')
                    .setTitle('🐠 Bạn đã câu được một con cá!')
                    .setDescription(`🎣 Tên: ${newFish.name}\n📏 Size: ${newFish.size}cm\n💰 Giá bán: ${newFish.sell}$`);

                return interaction.reply({ embeds: [embed] });
            }

            default:
                return interaction.reply('⚠️ Lệnh không hợp lệ. Vui lòng sử dụng: `register`, `shop`, `bag`, hoặc `fish`.');
        }
    },
};
