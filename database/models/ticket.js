const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  channelId: { type: String, required: true },
  staffRoleId: { type: String, required: true },
  logsChannelId: { type: String, required: true },
  transcriptChannelId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Ticket', ticketSchema);
