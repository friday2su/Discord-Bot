const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('10mm')
        .setDescription('Lấy email từ 10 phút mail')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Thao tác: new, list, more, get, check')
                .setRequired(true)
        ),
    async execute(interaction) {
        const action = interaction.options.getString('action');
        let message = '';

        try {
            if (action === 'new') {
                const res = await axios.get('https://10minutemail.net/address.api.php?new=1');
                const data = res.data;
                message = `\n**📧 Email mới:** ${data.mail_get_user}@${data.mail_get_host}\n` +
                          `⏳ **Thời gian còn lại:** ${data.mail_left_time}s`;
            } else if (action === 'list') {
                const res = await axios.get('https://www.phamvandienofficial.xyz/mail10p/domain');
                message = `📜 **Danh sách domain:**\n${res.data.domain.join('\n')}`;
            } else if (action === 'more') {
                const res = await axios.get('https://10minutemail.net/address.api.php?more=1');
                const data = res.data;
                message = `\n**📧 Email mới:** ${data.mail_get_user}@${data.mail_get_host}\n` +
                          `⏳ **Thời gian còn lại:** ${data.mail_left_time}s`;
            } else if (action === 'get') {
                const res = await axios.get('https://10minutemail.net/address.api.php');
                const data = res.data;
                message = `📧 **Email hiện tại:** ${data.mail_get_mail}\n🔗 **URL Mail:** ${data.permalink.url}`;
            } else if (action === 'check') {
                const res = await axios.get('https://10minutemail.net/address.api.php');
                const mailData = res.data.mail_list[0];
                message = `📧 **Email:** ${res.data.mail_get_mail}\n📬 **Từ:** ${mailData.from}\n📝 **Tiêu đề:** ${mailData.subject}\n📅 **Thời gian:** ${mailData.datetime2}`;
            } else {
                message = '❌ Lệnh không hợp lệ! Hãy chọn một trong các thao tác: new, list, more, get, check';
            }
        } catch (error) {
            message = '⚠️ Lỗi khi lấy dữ liệu từ API! Vui lòng thử lại sau.';
        }
        
        await interaction.reply({ content: message, ephemeral: false });
    }
};
