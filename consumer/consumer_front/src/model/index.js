const mongoose = require('mongoose');
const stockAlertSchema = require('./stockAlert');

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// 建立model
const stockAlert = mongoose.model('stockAlert', stockAlertSchema);

module.exports = { db, stockAlert };