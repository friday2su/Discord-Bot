const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  suggestions: [{
    messageId: { type: String, required: true },
    content: { type: String, required: true },
    //Nếu bạn có phiếu bầu, bạn có thể đưa chúng vào đây, nhưng bạn đã đề cập đến việc xóa phiếu bầu đó.
  }],
});

module.exports = mongoose.model('Suggestion', suggestionSchema);
