const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rdgai')
        .setDescription('Gửi một video ngẫu nhiên!'),
    async execute(interaction) {
        // Danh sách video từ file đã cung cấp
        const videos = [
            'https://i.imgur.com/6H6Zrck.mp4',
            'https://i.imgur.com/NxFnFid.mp4',
            'https://i.imgur.com/1qw7u1r.mp4',
            'https://i.imgur.com/PuuMSi3.mp4',
            'https://i.imgur.com/EVraFxe.mp4',
            'https://files.catbox.moe/3zabd3.mp4',
            'https://files.catbox.moe/fg00qo.mp4',
            'https://i.imgur.com/FBnICr3.mp4',
            'https://files.catbox.moe/z1lcnb.mp4',
            'https://i.imgur.com/Koz2rFW.mp4',
            'https://i.imgur.com/VghBApz.mp4',
            'https://files.catbox.moe/b00ali.mp4',
            'https://files.catbox.moe/l8a19e.mp4',
            'https://files.catbox.moe/63ilb0.mp4',
            'https://i.imgur.com/KrdxKsp.mp4',
            'https://files.catbox.moe/kj5vo6.mp4',
            'https://files.catbox.moe/ymxfxr.mp4',
            'https://files.catbox.moe/twskxk.mp4',
            'https://files.catbox.moe/w7skrp.mp4',
            'https://files.catbox.moe/2yakqy.mp4',
            'https://i.imgur.com/MiQE0fX.mp4',
            'https://files.catbox.moe/8p25kn.mp4',
            'https://i.imgur.com/zb8Kajv.mp4',
            'https://i.imgur.com/5qEGElw.mp4',
            'https://i.imgur.com/VWJWZbB.mp4',
            'https://i.imgur.com/HkMcqs7.mp4',
            'https://i.imgur.com/ka31ApU.mp4',
            'https://files.catbox.moe/9928bk.mp4',
            'https://files.catbox.moe/3ea1oy.mp4',
            'https://files.catbox.moe/jo2acw.mp4',
            'https://files.catbox.moe/q1m6wg.mp4',
            'https://files.catbox.moe/b2rbbd.mp4',
            'https://files.catbox.moe/keum3y.mp4',
            'https://files.catbox.moe/yf6muk.mp4',
            'https://files.catbox.moe/93efl5.mp4',
            'https://files.catbox.moe/qq86dc.mp4',
            'https://files.catbox.moe/iayeyd.mp4',
            'https://files.catbox.moe/mig3c7.mp4',
            'https://files.catbox.moe/73nqy3.mp4',
            'https://files.catbox.moe/i3f2ci.mp4',
            'https://i.imgur.com/OVeTon5.mp4',
            'https://i.imgur.com/e7W99XM.mp4',
            'https://files.catbox.moe/3efg3n.mp4',
            'https://files.catbox.moe/1u4479.mp4',
            'https://files.catbox.moe/2gbmfq.mp4',
            'https://i.imgur.com/SJYq7oh.mp4',
            'https://files.catbox.moe/7i8imi.mp4',
            'https://i.imgur.com/KLYTbwb.mp4',
            'https://i.imgur.com/hhxQoyT.mp4',
            'https://i.imgur.com/va72s5P.mp4',
            'https://files.catbox.moe/e2ksxx.mp4',
            'https://files.catbox.moe/dzmxdq.mp4',
            'https://files.catbox.moe/bzansh.mp4',
            'https://i.imgur.com/i8FctQb.mp4',
            'https://i.imgur.com/mbduKum.mp4',
            'https://files.catbox.moe/5ej5pj.mp4'
            
        ];

        // Lấy ngẫu nhiên một video từ danh sách
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];

        // Gửi video ngẫu nhiên
        await interaction.reply(randomVideo);
    },
};
