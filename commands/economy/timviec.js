const { SlashCommandBuilder } = require('discord.js');

// Danh sách công việc và mức lương
const jobs = ['Lập trình viên', 'Kế toán', 'Giáo viên', 'Bác sỹ', 'Thợ may', 'Nhân viên bán hàng', 'Quản lý bán hàng', 'Nhân viên văn phòng', 'Chăm sóc khách hàng', 'Marketing', 'Kiểm toán viên', 'Nhà thiết kế', 'Thợ điện', 'Thợ sửa chữa', 'Thiết kế nội thất', 'Nhân viên thư viện', 'Biên tập viên', 'Người mẫu', 'Bán hàng online', 'Tư vấn viên khách hàng'];
const salaryRange = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000];

// Giả lập database quản lý tiền người dùng
const userBalances = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tcv')
    .setDescription('Tìm công việc và kiếm tiền ngẫu nhiên'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Tìm công việc ngẫu nhiên và tính thưởng
    const congviec = jobs[Math.floor(Math.random() * jobs.length)];
    const tien = salaryRange[Math.floor(Math.random() * salaryRange.length)];

    // Cập nhật tiền người dùng
    const previousMoney = userBalances.get(userId) || 0;
    const newBalance = previousMoney + tien;
    userBalances.set(userId, newBalance);

    // Gửi phản hồi
    await interaction.reply(`👔 **===𝐶𝑜̂𝑛𝑔 𝑣𝑖𝑒̣̂𝑐 𝑡𝑖̀𝑚 đ𝑢̛𝑜̛̣𝑐===:** ${congviec}\n💰 **===𝑆𝑜̂́ 𝑡𝑖𝑒̂̀𝑛 𝑏𝑎̣𝑛 𝑘𝑖𝑒̂́𝑚 đ𝑢̛𝑜̛̣𝑐===:** ${tien} Xc\n🏦 **===𝑇𝑜̂̉𝑛𝑔 𝑠𝑜̂́ 𝑑𝑢̛ ℎ𝑖𝑒̣̂𝑛 𝑡𝑎̣𝑖===:** ${newBalance} Xc`);
  },
};
