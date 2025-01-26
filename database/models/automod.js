const mongoose = require('mongoose');

const autoModSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  antiInvites: { type: Boolean, default: false },
  antiLinks: { type: Boolean, default: false },
  antiSpam: { type: Boolean, default: false },
  whitelist: { type: [String], default: [] }, // ID và vai trò
});

module.exports = mongoose.model('AutoMod', autoModSchema);
