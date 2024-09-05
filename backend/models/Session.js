// models/Session.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{ type: String }]
});

module.exports = mongoose.model('Session', SessionSchema);
