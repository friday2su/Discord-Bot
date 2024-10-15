const AutoMod = require('./database/models/automod'); // Assuming the AutoMod model is in the models folder

module.exports = async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  const guildId = message.guild.id;
  const autoModSettings = await AutoMod.findOne({ guildId });

  if (!autoModSettings) return; // If no settings, exit

  // Function to send a warning message in the same channel
  const sendWarning = async (reason) => {
    const warningMessage = `🚫 **Warning!** Your message was deleted due to: **${reason}**.`;
    const warning = await message.channel.send(warningMessage); // Send the warning message
    setTimeout(() => warning.delete(), 10000); // Delete the warning message after 10 seconds
  };

  // Check for anti-invite
  if (autoModSettings.antiInvites && /discord\.gg|discord\.com\/invite/.test(message.content)) {
    await sendWarning('Anti-invite protection'); // Send a warning
    return message.delete(); // Delete the original message
  }

  // Check for anti-links
  if (autoModSettings.antiLinks && /https?:\/\/[^\s]+/.test(message.content)) {
    await sendWarning('Anti-link protection'); // Send a warning
    return message.delete(); // Delete the original message
  }

  // Check for anti-spam (basic logic)
  if (autoModSettings.antiSpam) {
    const userMessages = message.channel.messages.cache.filter(m => m.author.id === message.author.id);
    
    // Limit to last 5 messages in the last 10 seconds
    if (userMessages.size > 5) {
      await sendWarning('Anti-spam protection'); // Send a warning
      return message.delete(); // Delete the original message if too many messages sent
    }
  }

  // Check whitelist
  if (autoModSettings.whitelist.includes(message.author.id)) return; // If user is whitelisted, exit
  if (message.mentions.roles.size > 0) {
    for (const role of message.mentions.roles.values()) {
      if (autoModSettings.whitelist.includes(role.id)) return; // If role is whitelisted, exit
    }
  }
};
