const mongoose = require('mongoose');

const stockBasicSchema = new mongoose.Schema({
  id: { type: String, index: true },
  stock: { type: String, index: true },
  industry: String,
},
{
  timestamps: false
});

module.exports = stockBasicSchema;