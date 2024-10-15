const mongoose = require('mongoose');

const autoModSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  antiInvites: { type: Boolean, default: false },
  antiLinks: { type: Boolean, default: false },
  antiSpam: { type: Boolean, default: false },
  whitelist: { type: [String], default: [] }, // Array of user/role IDs
});

module.exports = mongoose.model('AutoMod', autoModSchema);
