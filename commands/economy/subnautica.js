const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');

const dataPath = path.join(__dirname, 'game', 'cauca', 'datauser');
const itemPath = path.join(__dirname, 'game', 'cauca', 'item.json');

async function ensureDirectoryStructure() {
    if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('subnautica')
        .setDescription('Trò chơi câu cá Subnautica đầy thú vị!')
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

            case 'fish': {
                if (!fs.existsSync(userFilePath)) {
                    return interaction.reply('⚠️ Bạn chưa đăng ký khu vực câu cá.');
                }

                // Đọc dữ liệu các vùng và sinh vật từ item.json
                const fishingData = JSON.parse(fs.readFileSync(itemPath));
                
                // Chọn ngẫu nhiên một vùng và một sinh vật trong vùng
                const randomLocation = getRandomElement(fishingData);
                const randomArea = getRandomElement(randomLocation.area);
                const randomFish = getRandomElement(randomArea.creature);

                const caughtFish = {
                    name: randomFish.name,
                    category: randomFish.category,
                    size: randomFish.size,
                    sell: randomFish.sell,
                    image: randomFish.image,
                    location: `${randomLocation.location} - ${randomArea.name}`
                };

                const userData = JSON.parse(fs.readFileSync(userFilePath));
                userData.fishBag.push(caughtFish);
                fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 4));

                const embed = new EmbedBuilder()
                    .setColor('Aqua')
                    .setTitle('🐠 Bạn đã câu được một con cá!')
                    .setDescription(`🎣 **Tên:** ${caughtFish.name}\n📏 **Kích thước:** ${caughtFish.size} cm\n💰 **Giá bán:** ${caughtFish.sell} $\n🏞️ **Khu vực:** ${caughtFish.location}\n📊 **Loại:** ${caughtFish.category}`)
                    .setThumbnail(caughtFish.image);

                return interaction.reply({ embeds: [embed] });
            }

            default:
                return interaction.reply('⚠️ Lệnh không hợp lệ. Vui lòng sử dụng: `register`, `shop`, `bag`, hoặc `fish`.');
        }
    },
};


//npm install discord.js @discordjs/builders fs-extra axios
