// events/messageDelete.js
const { Events } = require('discord.js');

let lastDeletedMessage = null;

module.exports = {
  name: Events.MessageDelete,
  execute(message) {
    // Check if the message is not partial (i.e., fully loaded)
    if (!message.partial && !message.author.bot) {
      lastDeletedMessage = message;
    }
  },
  getLastDeletedMessage() {
    return lastDeletedMessage;
  }
};
