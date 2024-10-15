const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  suggestions: [{
    messageId: { type: String, required: true },
    content: { type: String, required: true },
    // If you had votes, you could include them here, but you've mentioned to remove that.
  }],
});

module.exports = mongoose.model('Suggestion', suggestionSchema);
