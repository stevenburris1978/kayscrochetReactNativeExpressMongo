const mongoose = require('mongoose');

const pushTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  }
});

const PushToken = mongoose.model('PushToken', pushTokenSchema);

module.exports = PushToken;
