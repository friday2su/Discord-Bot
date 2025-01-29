import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import axios from 'axios';

const minerals = [
  { name: '𝗖𝗼𝗮𝗹', coinValue: getRandomValue(5, 10) },
  { name: '𝗜𝗿𝗼𝗻', coinValue: getRandomValue(10, 15) },
  { name: '𝗕𝗿𝗼𝗻𝘇𝗲', coinValue: getRandomValue(15, 20) },
  { name: '𝗦𝗶𝗹𝘃𝗲𝗿', coinValue: getRandomValue(20, 25) },
  { name: '𝗚𝗼𝗹𝗱', coinValue: getRandomValue(30, 35) },
  { name: '𝗗𝗶𝗮𝗺𝗼𝗻𝗱', coinValue: getRandomValue(35, 50) },
  // Add more minerals here
];

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const data = new SlashCommandBuilder()
  .setName('mining')
  .setDescription('Thử vận may khai thác khoáng sản và nhận thưởng!');

export async function execute(interaction) {
  const mineImage = (await axios.get("https://i.imgur.com/w9ueJGi.gif", {
    responseType: "arraybuffer"
  })).data;

  try {
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

    // Tạo embed thông báo kết quả
    const embed = new EmbedBuilder()
      .setColor('Gold')
      .setTitle(`⛏️ Khai thác khoáng sản!`)
      .setDescription(replyMessage)
      .setTimestamp();

    // Gửi tin nhắn với ảnh đính kèm
    const attachment = new AttachmentBuilder(mineImage, { name: 'mining.gif' });
    await interaction.reply({ embeds: [embed], files: [attachment] });

    // Cập nhật số tiền cho người dùng (giả sử có hàm Users.increaseMoney)
    const targetID = interaction.user.id; // ID của người dùng
    await Users.increaseMoney(targetID, totalAmount);

  } catch (error) {
    console.error(error);
    await interaction.reply('𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚖𝚒𝚗𝚒𝚗𝚐!');
  }
}

export default {
  data,
  execute,
};
