const mongoose = require('mongoose');

const stockAlertSchema = new mongoose.Schema({
  stock: { type: String, index: true },
  type: { type: String, index: true },
  timestamp: { type: Date, index: true },
  init: { type: Boolean, index: true },
  industry: String,
  price: Number,
  msg: String,
  lastK: Number,
  lastD: Number,
  up: Boolean
},
{
  timestamps: false
});

module.exports = stockAlertSchema;