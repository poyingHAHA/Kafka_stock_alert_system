const mongoose = require('mongoose');
const stockAlertSchema = require('./stockAlert');
const stockBasicSchema = require('./stockBasic');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect("mongodb://localhost:27017/stockAlert", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// 建立model
const stockAlert = mongoose.model('stockAlert', stockAlertSchema);
const stockBasic = mongoose.model('stockBasic', stockBasicSchema);

module.exports = { db, stockAlert, stockBasic };