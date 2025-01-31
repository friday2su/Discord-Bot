const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { cpu, cpuTemperature, currentLoad, mem, osInfo, diskLayout, networkInterfaces, fsSize, users } = require("systeminformation");

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function getSystemInfo() {
    const [cpuData, tempData, loadData, memData, osData, diskData, networkData, fsData, userData] = await Promise.all([
        cpu(),
        cpuTemperature(),
        currentLoad(),
        mem(),
        osInfo(),
        diskLayout(),
        networkInterfaces(),
        fsSize(),
        users(),
    ]);

    return {
        cpuData,
        tempData,
        loadData,
        memData,
        osData,
        diskData,
        networkData,
        fsData,
        userData
    };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('system')
        .setDescription('Hiển thị thông tin hệ thống và hình ảnh ngẫu nhiên từ API'),
    async execute(interaction) {
        try {
            // Gọi API lấy hình ảnh từ API gái xinh
            const imageResponse = await axios.get('https://huu-tri-api.onrender.com/gaixinh');
            const imageUrl = imageResponse.data.url || null;
            const imageAuthor = imageResponse.data.author || 'N/A';

            // Lấy thông tin hệ thống
            const {
                cpuData, tempData, loadData, memData, osData, diskData, networkData, fsData
            } = await getSystemInfo();

            // Tạo Embed hiển thị thông tin
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('📊 Thông tin hệ thống')
                .addFields(
                    { name: '🖥️ CPU', value: `${cpuData.manufacturer} ${cpuData.brand} (${cpuData.speedMax}GHz)\nCores: ${cpuData.physicalCores} | Threads: ${cpuData.cores}\nNhiệt độ: ${tempData.main}°C`, inline: false },
                    { name: '📈 Tải CPU', value: `${loadData.currentLoad.toFixed(1)}%`, inline: true },
                    { name: '💾 RAM', value: `Tổng: ${formatBytes(memData.total)} | Đã sử dụng: ${formatBytes(memData.used)}\nCòn trống: ${formatBytes(memData.available)}`, inline: false },
                    { name: '💽 Ổ đĩa', value: `${diskData.map(disk => `${disk.name}: ${formatBytes(disk.size)}`).join(', ')}`, inline: false },
                    { name: '🌐 OS', value: `${osData.distro} (${osData.arch})`, inline: true },
                    { name: '🕸️ Mạng', value: `${networkData.map(net => `${net.ip4} (${net.type})`).join(', ')}`, inline: false }
                )
                .setImage(imageUrl)
                .setFooter({ text: `Nguồn ảnh: ${imageAuthor}`, iconURL: 'https://cdn-icons-png.flaticon.com/512/146/146031.png' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌ Đã xảy ra lỗi khi lấy thông tin hệ thống hoặc gọi API ảnh.',
                ephemeral: true
            });
        }
    },
};
//npm install axios;npm install systeminformation
