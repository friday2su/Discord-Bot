const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

// Danh sách các loại cá
const fishList = [
    { name: "Cá chà bặc 🐧", rate: 0.25, point: 10, coin: 10000 },
    { name: "Megalondon 🤯", rate: 0.10, point: 99, coin: 100000 },
    { name: "Cá rỉa hết mồi", rate: 0.35, point: 0, coin: 0 },
    { name: "Cá rô 🐟", rate: 0.20, point: 5, coin: 500 },
    { name: "Cá vàng 🐠", rate: 0.10, point: 50, coin: 5000 },
    { name: "Cá vàng special", rate: 0.5, point: 99, coin: 900 },
    { name: "𝐂𝚛𝚞𝚜𝚑", rate: 1.5, point: 1505, coin: 9999999 },
  { name: "Người yêu", rate: 1.5, point: 40, coin: 100 },
  { name: "Cá đuối", rate: 2, point: 101, coin: 150 },
  { name: "Cá Linh", rate: 2, point: 10, coin: 120 },
  { name: "Hộp đồ ăn nhanh", rate: 1.5, point: 0, coin: 0.5 },
  { name: "Rác thải", rate: 1, point: 1, coin: 0.5 },
  { name: "Ba ba", rate: 2, point: 50, coin: 170 },
  { name: "Cá heo hồng", rate: 0.5, point: 90, coin: 300 },
  { name: "Rùa biển", rate: 1, point: 80, coin: 280 },
  { name: "Táo thối", rate: 0.5, point: 0, coin: 0 },
  { name: "Cá bạc má", rate: 2, point: 20, coin: 100 },
  { name: "Cá sa ba", rate: 3, point: 15, coin: 190 },
  { name: "Cá mặt Trăng", rate: 2, point: 0, coin: 0 },
  { name: "Sứa biển", rate: 2, point: 5, coin: 50 },
  { name: "Cá chiên dòn", rate: 2, point: 10, coin: 20 },
  { name: "Sao biển", rate: 0.75, point: 20, coin: 50 },
  { name: "Cá Lã Vọng", rate: 1.25, point: 40, coin: 199 },
  { name: "Cá Mập con", rate: 1, point: 120, coin: 400 },
  { name: "Cá thu", rate: 2.75, point: 30, coin: 170 },
  { name: "Cá thác lác", rate: 3, point: 15, coin: 150 },
  { name: "Cá ngừ", rate: 2.25, point: 25, coin: 130 },
  { name: "Cá hố", rate: 2, point: 15,  coin: 100 },
  { name: "Cá da bò", rate: 1.75, point: 10, coin: 80 },
  { name: "Cá da trơn", rate: 1.75, point: 12, coin: 80 },
  { name: "Cá phượng hoàng🐧", rate: 0.5, point: 8, coin: 30 },
  { name: "Cá cơm", rate: 2.75, point: 20, coin: 120 },
  { name: "Cá ngựa", rate: 1, point: 35, coin: 270 },
  { name: "Cá mú", rate: 2, point: 18, coin: 100 },
  { name: "Cá sọc dưa", rate: 2.25, point: 22, coin: 175 },
  { name: "Cá ngựa con", rate: 1.25, point: 8, coin: 50 },
{ name: "Gãy cần câu", rate: 1.25, point: 0, coin: 0 },
{ name: "Mực ống", rate: 2, point: 15, coin: 290 },
{ name: "Mực lá", rate: 2, point: 15, coin: 150 },
{ name: "Mực mai", rate: 2, point: 15, coin: 150 },
  { name: "Mực sim", rate: 2, point: 15, coin: 159 },
  { name: "Cá sẩy mất", rate: 1.75, point: 1, coin: 0 },
  { name: "Rái cá", rate: 1.25, point: 5, coin: 10 },
  { name: "Cá ngừ đại dương", rate: 1.5, point: 40, coin: 400 },
  { name: "Cá hồi xốp", rate: 1.5 , point: 35, coin: 350 },
  { name: "Ngao biển", rate: 1.5, point: 5, coin: 80 },
  { name: "Cua biển", rate: 1.5, point: 5, coin: 80 },
  { name: "Ghẹ biển", rate: 1.5, point: 5, coin: 80 },
  { name: "Chìm thuyền", rate: 1, point: 0, coin: 0 },
  { name: "Cá voi", rate: 1, point: 200, coin: 100 },
  { name: "Phân cá voi", rate: 0.5, point: 1000, coin: 1700 },
  { name: "Cá heo", rate: 2, point: 115, coin: 550 },
  { name: "Bạch tuột", rate: 3, point: 10, coin: 200 },
  { name: "Bạch tuột con", rate: 2.5, point: 7, coin: 120 },
  { name: "Kho báo", rate: 1, point: 1000, coin: 1000 }
];

// Hàm chọn cá ngẫu nhiên dựa trên tỷ lệ
function getRandomFish() {
    const totalRate = fishList.reduce((sum, fish) => sum + fish.rate, 0);
    const random = Math.random() * totalRate;
    let cumulativeRate = 0;

    for (const fish of fishList) {
        cumulativeRate += fish.rate;
        if (random <= cumulativeRate) {
            return fish;
        }
    }
    return fishList[fishList.length - 1]; // Fallback
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cauca')
        .setDescription('Thử vận may câu cá và nhận thưởng!'),
    async execute(interaction) {
        const fish = getRandomFish(); // Lấy cá ngẫu nhiên
        const user = interaction.user.tag; // Tên người dùng

        // Tạo embed thông báo kết quả
        const embed = new EmbedBuilder()
            .setColor(fish.coin > 0 ? 'Green' : 'Red') // Màu xanh nếu có thưởng, đỏ nếu không
            .setTitle(`🎣 ${user} đã câu được một con cá!`)
            .setDescription(`**Tên cá:** ${fish.name}\n**Điểm:** ${fish.point}\n**XC nhận được:** ${fish.coin} XC`)
            .setTimestamp();

        // Gửi kết quả
        await interaction.reply({ embeds: [embed] });

        // (Tùy chọn) Thêm logic lưu XC vào cơ sở dữ liệu nếu bạn cần
        // Ví dụ: db.updateUserXC(interaction.user.id, fish.coin);
    },
};

