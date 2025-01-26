const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  messageId: { type: String, required: true },
  duration: { type: Number, required: true },
  winners: { type: Number, required: true },
  prize: { type: String, required: true },
  participants: { type: Array, default: [] },
  ended: { type: Boolean, default: false },
});
// tham gia give away đê là bt.3
module.exports = mongoose.model('Giveaway', giveawaySchema);
