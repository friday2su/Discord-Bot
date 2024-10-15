const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  invites: { type: Number, default: 0 }
});

module.exports = mongoose.model('Invite', inviteSchema);
