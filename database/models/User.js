const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  cash: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  lastDaily: { type: Date, default: null },
  lastBeg: { type: Date, default: null },
  lastLootbox: { type: Date, default: null },
  lastWork: { type: Date, default: null },
  lastRob: { type: Date, default: null }
});
//mấy cái lồn j đấy nó sẽ lưu về cho user
module.exports = mongoose.model('User', userSchema);
