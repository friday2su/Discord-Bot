const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rdgai')
        .setDescription('Gửi một video ngẫu nhiên!'),
    async execute(interaction) {
        // Danh sách video
        const videos = [
            'https://i.imgur.com/6H6Zrck.mp4',
            'https://i.imgur.com/NxFnFid.mp4',
            'https://i.imgur.com/1qw7u1r.mp4',
            "https://files.catbox.moe/iayeyd.mp4,
"https://i.imgur.com/IfvmD5N.mp4",
"https://files.catbox.moe/g6xx6b.mp4",
"https://files.catbox.moe/1569to.mp4,
"https://i.imgur.com/Cyz6B8r.mp4",
"https://i.imgur.com/u3hvoGa.mp4",
"https://files.catbox.moe/qikju9.mp4",
"https://i.imgur.com/kT7cEs0.mp4",
"https://files.catbox.moe/00rtri.mp4",
"https://files.catbox.moe/1zwxkb.mp4",
"https://files.catbox.moe/d9dym8.mp4",
"https://files.catbox.moe/wl3yso.mp4",
"https://files.catbox.moe/f4m32o.mp4",
"https://i.imgur.com/hsZbRNH.mp4"
"https://files.catbox.moe/w4tg29.mp4",
"https://files.catbox.moe/mgoe85.mp4",
"https://i.imgur.com/ps1ZlIg.mp4",
"https://files.catbox.moe/1zwxkb.mp4",
"https://files.catbox.moe/v2roqo.mp4",
"https://i.imgur.com/nW7kPPa.mp4",
"https://files.catbox.moe/2n8nb3.mp4",
"https://i.imgur.com/7arI6vL.mp4",
"https://i.imgur.com/OVeTon5.mp4",
"https://files.catbox.moe/93efl5.mp4",
"https://files.catbox.moe/q1ui1f.mp4",
"https://i.imgur.com/UWocDVu.mp4",
"https://i.imgur.com/KD883PX.mp4",
"https://files.catbox.moe/f19yv0.mp4",
"https://files.catbox.moe/cnd0ho.mp4",
"https://files.catbox.moe/0sw1g2.mp4",
"https://i.imgur.com/hhxQoyT.mp4",
"https://i.imgur.com/VWJWZbB.mp4",
"https://files.catbox.moe/zxoo18.mp4",
"https://files.catbox.moe/p3rmwi.mp4",
"https://files.catbox.moe/7i8imi.mp4",
"https://files.catbox.moe/6l84az.mp4",
"https://files.catbox.moe/e2xwuv.mp4",
"https://files.catbox.moe/n441hg.mp4",
"https://i.imgur.com/aSnMoub.mp4",
"https://files.catbox.moe/oviem1.mp4",
"https://i.imgur.com/7F1fZ4v.mp4",
"https://i.imgur.com/kn90olP.mp4",
"https://files.catbox.moe/s8om65.mp4",
"https://files.catbox.moe/az5s5a.mp4",
"https://files.catbox.moe/ndnphb.mp4",
"https://i.imgur.com/tJmyKlJ.mp4",
"https://i.imgur.com/SJYq7oh.mp4",
"https://files.catbox.moe/1px71z.mp4",
"https://i.imgur.com/i8FctQb.mp4",
"https://i.imgur.com/OVeTon5.mp4",
"https://i.imgur.com/tKKaADP.mp4",
"https://files.catbox.moe/7i8imi.mp4",
"https://i.imgur.com/GBnOMSQ.mp4",
"https://files.catbox.moe/j0nj3e.mp4",
"https://files.catbox.moe/z1lcnb.mp4",
"https://i.imgur.com/d9SCS9O.mp4,"
"https://files.catbox.moe/k1hkgd.mp4",
"https://files.catbox.moe/fg00qo.mp4",
"https://files.catbox.moe/4ijnic.mp4",
"https://i.imgur.com/u3hvoGa.mp4",
"https://files.catbox.moe/2gbmfq.mp4",
"https://files.catbox.moe/e2xwuv.mp4",
"https://files.catbox.moe/qy02g5.mp4",
"https://files.catbox.moe/bzansh.mp4",
"https://i.imgur.com/7F1fZ4v.mp4",
"https://files.catbox.moe/uiy153.mp4",
"https://i.imgur.com/sQkFXuU.mp4",
"https://files.catbox.moe/kj5vo6.mp4",
"https://files.catbox.moe/111zof.mp4"

        ];

        // Lấy ngẫu nhiên một video từ danh sách
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        // Gửi video ngẫu nhiên
        await interaction.reply(randomVideo);
    },
};

