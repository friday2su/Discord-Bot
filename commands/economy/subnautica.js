const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');

const dataPath = path.join(__dirname, 'game', 'cauca', 'datauser');
const fishPath = path.join(__dirname, 'game', 'cauca', 'data.json');
const rodPath = path.join(__dirname, 'game', 'cauca', 'item.json');

async function ensureDirectoryStructure() {
    if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('subnautica')
        .setDescription('Angel fish By Minh Son!')
        .addStringOption(option =>
            option.setName('command')
                .setDescription('Nhập lệnh: register, shop, buy, bag, fish, locate, rod')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('item')
                .setDescription('Nhập số thứ tự vật phẩm cần mua')
                .setRequired(false)
        ),
    async execute(interaction) {
        const command = interaction.options.getString('command');
        const itemIndex = interaction.options.getInteger('item');
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
                    money: 1000,
                    timeRegister: new Date().toLocaleString()
                };
                fs.writeFileSync(userFilePath, JSON.stringify(initialData, null, 4));
                const embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('🦈 Subnautica')
                    .setDescription('⚓ Đăng ký khu vực câu cá thành công! Chúc bạn câu cá vui vẻ 🎣');
                return interaction.reply({ embeds: [embed] });
            }
            
            case 'shop': {
                if (!fs.existsSync(rodPath)) {
                    return interaction.reply('⚠️ Không tìm thấy dữ liệu cần câu!');
                }
                const rodData = JSON.parse(fs.readFileSync(rodPath));
                let rodList = rodData.rods.map((rod, index) => `🎣 **${index + 1}. ${rod.name}** - 💰 Giá: ${rod.price}$ - ⚙️ Độ bền: ${rod.durability}`).join('\n');
                return interaction.reply(`🏪 **Cửa hàng cần câu:**\n${rodList}\n\n💬 Dùng "/subnautica buy <số thứ tự>" để mua!`);
            }
            
            case 'buy': {
                if (!fs.existsSync(rodPath)) {
                    return interaction.reply('⚠️ Không tìm thấy dữ liệu cần câu!');
                }
                if (!fs.existsSync(userFilePath)) {
                    return interaction.reply('⚠️ Bạn chưa đăng ký khu vực câu cá. Hãy dùng "/subnautica register" trước.');
                }
                const rodData = JSON.parse(fs.readFileSync(rodPath));
                const userData = JSON.parse(fs.readFileSync(userFilePath));
                if (itemIndex < 1 || itemIndex > rodData.rods.length) {
                    return interaction.reply('⚠️ Số thứ tự không hợp lệ. Hãy chọn số từ danh sách cửa hàng.');
                }
                const selectedRod = rodData.rods[itemIndex - 1];
                if (userData.money < selectedRod.price) {
                    return interaction.reply('💰 Bạn không đủ tiền để mua cần câu này!');
                }
                userData.money -= selectedRod.price;
                userData.item.push(selectedRod);
                fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 4));
                return interaction.reply(`🎉 Bạn đã mua **${selectedRod.name}** với giá **${selectedRod.price}$**! Số tiền còn lại: **${userData.money}$**`);
            }
            
            case 'fish': {
                if (!fs.existsSync(userFilePath)) {
                    return interaction.reply('⚠️ Bạn chưa đăng ký khu vực câu cá.');
                }
                const userData = JSON.parse(fs.readFileSync(userFilePath));
                if (!userData.mainRod) {
                    return interaction.reply('🎣 Bạn chưa có cần câu! Mua trong shop trước nhé.');
                }
                const fishingData = JSON.parse(fs.readFileSync(fishPath));
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
                userData.fishBag.push(caughtFish);
                fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 4));
                
                const embed = new EmbedBuilder()
                    .setColor('Aqua')
                    .setTitle('🎣 Bạn đã câu được một con cá!')
                    .setDescription(`🐟 **Tên:** ${caughtFish.name}\n📏 **Kích thước:** ${caughtFish.size} cm\n💰 **Giá bán:** ${caughtFish.sell}$\n🏞️ **Khu vực:** ${caughtFish.location}\n📊 **Loại:** ${caughtFish.category}`)
                    .setThumbnail(caughtFish.image);
                
                const sellButton = new ButtonBuilder()
                    .setCustomId(`sell_${userId}_${caughtFish.name}_${caughtFish.sell}`)
                    .setLabel('Bán cá')
                    .setStyle(ButtonStyle.Success);
                
                const row = new ActionRowBuilder().addComponents(sellButton);
                return interaction.reply({ embeds: [embed], components: [row] });
            }
            
            default:
                return interaction.reply('⚠️ Lệnh không hợp lệ. Vui lòng sử dụng: register, shop, buy, bag, fish, locate, rod.');
        }
    }
};

//npm install discord.js @discordjs/builders fs-extra axios
