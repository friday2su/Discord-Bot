const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const axios = require('axios');

const minerals = [
  { name: 'Coal', coinValue: getRandomValue(5, 10) },
  { name: 'Iron', coinValue: getRandomValue(10, 15) },
  { name: 'Bronze', coinValue: getRandomValue(15, 20) },
  { name: 'Silver', coinValue: getRandomValue(20, 25) },
  { name: 'Gold', coinValue: getRandomValue(30, 35) },
  { name: 'Diamond', coinValue: getRandomValue(35, 50) },
];

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mining')
    .setDescription('Thăm ngàn rồi sẽ có lúa!'),
  
  async execute(interaction) {
    try {
      const mineImage = (await axios.get("https://i.imgur.com/w9ueJGi.gif", { responseType: "arraybuffer" })).data;

      let totalAmount = 0;
      let minedData = [];

      for (let i = 0; i < 3; i++) {
        const randomMineral = minerals[Math.floor(Math.random() * minerals.length)];

        const name = randomMineral.name;
        const coin = randomMineral.coinValue;

        totalAmount += coin;

        minedData.push({
          name: `𝙼𝚒𝚗𝚎𝚛𝚊𝚕: ${name}`,
          coin: ` ${coin.toLocaleString()} 𝚌𝚘𝚒𝚗𝚜`
        });
      }

      let replyMessage = `⛏️  𝗬𝗼𝘂 𝗵𝗮𝘃𝗲 𝗺𝗶𝗻𝗲𝗱  ⛏️\n`;
      for (let i = 0; i < minedData.length; i++) {
        replyMessage += `✓ ${minedData[i].name}: ${minedData[i].coin}\n`;
      }

      replyMessage += `💰 Total 𝚌𝚘𝚒𝚗𝚜 earned: ${totalAmount.toLocaleString()} 𝚌𝚘𝚒𝚗𝚜 💰`;

      const embed = new EmbedBuilder()
        .setColor('Gold')
        .setTitle(`⛏️ Khai thác khoáng sản!`)
        .setDescription(replyMessage)
        .setTimestamp();

      const attachment = new AttachmentBuilder(Buffer.from(mineImage), { name: 'mining.gif' });
      await interaction.reply({ embeds: [embed], files: [attachment] });

    } catch (error) {
      console.error(error);
      await interaction.reply('❌ Có lỗi khi Đào!');
    }
  }
};
