const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const traits = {
    t: ["Người đẹp không tuổi", "Không rõ tuổi", "Tuổi con ngan", "Tuổi con tép", "Tuổi trẻ tài cao", "Tuổi ngang tầm vũ trụ", "Ẩn danh"],
    tc: ["Tự tin", "Chầm tính", "Tự ti", "Khó tính", "Hiền lành", "Mạnh mẽ", "Người tình cảm", "Tham vọng"],
    y: ["Tiền", "Tình yêu", "Gia đình", "Sự nghiệp", "Màu hồng", "Thú cưng", "Công việc"],
    g: ["Nói dối", "Cục súc", "Nói nhiều", "Không biết yêu thương", "Lười biếng", "Thích bạo lực", "Giả dối"],
    mt: ["Quá độc lập", "Nói nhiều", "Tiêu cực", "Không suy nghĩ cho bản thân", "Khao khát bạo lực"],
    ms: ["Vui vẻ", "Bình yên", "Nhây", "Năng động", "Hay giúp đỡ người khác", "Đúng giờ", "Trung thành"],
    bm: ["Body đẹp", "Nhiều tiền", "Ẩn danh", "Giỏi công nghệ", "Học giỏi", "Thích ăn uống"],
    tk: ["Người có tâm hồn đẹp", "Phóng khoáng", "Hay giúp đỡ", "Lý trí", "Dễ tính"],
};

function calculateRandomPoints() {
    return {
        age: Math.floor(Math.random() * traits.t.length),
        personality: Math.floor(Math.random() * traits.tc.length),
        likes: Math.floor(Math.random() * traits.y.length),
        dislikes: Math.floor(Math.random() * traits.g.length),
        darkSide: Math.floor(Math.random() * traits.mt.length),
        brightSide: Math.floor(Math.random() * traits.ms.length),
        secrets: Math.floor(Math.random() * traits.bm.length),
        overall: Math.floor(Math.random() * traits.tk.length)
    };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('phantich')
        .setDescription('Phân tích thông tin người dùng từ Discord!')
        .addUserOption(option => option.setName('user').setDescription('Người dùng cần phân tích').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const points = calculateRandomPoints();

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`📊 Phân tích cho ${user.username}`)
            .setDescription(`
                👽 **Tuổi:** ${traits.t[points.age]} (+${points.age} điểm)
                🤖 **Tính cách:** ${traits.tc[points.personality]} (+${points.personality} điểm)
                💗 **Yêu thích:** ${traits.y[points.likes]} (+${points.likes} điểm)
                💀 **Ghét:** ${traits.g[points.dislikes]} (+${points.dislikes} điểm)
                ⬛ **Mặt tối:** ${traits.mt[points.darkSide]} (-${points.darkSide} điểm)
                ⬜ **Mặt sáng:** ${traits.ms[points.brightSide]} (+${points.brightSide} điểm)
                🔐 **Bí mật:** ${traits.bm[points.secrets]} (-${points.secrets} điểm)
                ⚖ **Tổng kết:** ${traits.tk[points.overall]} (${points.overall} điểm)
            `)
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('phantich_reanalyze')
                    .setLabel('Phân tích lại')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({ embeds: [embed], components: [row] });

        const collector = interaction.channel.createMessageComponentCollector({ time: 30000 });

        collector.on('collect', async i => {
            if (i.customId === 'phantich_reanalyze') {
                const newPoints = calculateRandomPoints();
                const newEmbed = new EmbedBuilder()
                    .setColor('Blue')
                    .setTitle(`📊 Phân tích lại cho ${user.username}`)
                    .setDescription(`
                        👽 **Tuổi:** ${traits.t[newPoints.age]} (+${newPoints.age} điểm)
                        🤖 **Tính cách:** ${traits.tc[newPoints.personality]} (+${newPoints.personality} điểm)
                        💗 **Yêu thích:** ${traits.y[newPoints.likes]} (+${newPoints.likes} điểm)
                        💀 **Ghét:** ${traits.g[newPoints.dislikes]} (+${newPoints.dislikes} điểm)
                        ⬛ **Mặt tối:** ${traits.mt[newPoints.darkSide]} (-${newPoints.darkSide} điểm)
                        ⬜ **Mặt sáng:** ${traits.ms[newPoints.brightSide]} (+${newPoints.brightSide} điểm)
                        🔐 **Bí mật:** ${traits.bm[newPoints.secrets]} (-${newPoints.secrets} điểm)
                        ⚖ **Tổng kết:** ${traits.tk[newPoints.overall]} (${newPoints.overall} điểm)
                    `)
                    .setThumbnail(user.displayAvatarURL())
                    .setTimestamp();

                await i.update({ embeds: [newEmbed], components: [row] });
            }
        });

        collector.on('end', () => {
            interaction.editReply({ components: [] });
        });
    },
};
