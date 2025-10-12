const mongoose = require('mongoose');
const ReadingSchema = new mongoose.Schema({
  deviceId: String,
  timestamp: { type: Date, default: Date.now },
  tempC: Number,
  distanceCm: Number,
  status: String
});
module.exports = mongoose.model('Reading', ReadingSchema);
