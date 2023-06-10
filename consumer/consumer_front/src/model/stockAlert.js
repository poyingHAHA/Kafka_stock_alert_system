const mongoose = require('mongoose');

const stockAlertSchema = new mongoose.Schema({
  stock_id: { type: String, index: true },
  stock: { type: String, index: true },
  type: { type: String, index: true },
  timestamp: { type: Date, index: true },
  initial: { type: Boolean, index: true },
  industry: String,
  price: Number,
  msg: String,
  lastK: Number,
  lastD: Number,
  shortSMA: Number,
  longSMA: Number,
  diff: Number,
  std: Number,
  Middlebband: Number,
  Upperbband: Number,
  Lowerbband: Number,
  up: Boolean
},
{
  timestamps: false
});

module.exports = stockAlertSchema;