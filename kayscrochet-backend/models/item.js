const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: String,
  date: Date,
  images: [String],
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
