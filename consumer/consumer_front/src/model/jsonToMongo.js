const mongoose = require('mongoose');
const {stockAlert, stockBasic} = require('./index.js');
const fs = require("fs");

// (async () => {
//   const files = fs.readdirSync('../../jsons')
//   for (const file of files) {
//     console.log(`正在處理檔案 ${file}`);
//     const data = fs.readFileSync(`../../jsons/${file}`, 'utf8')
//     const jsonData = JSON.parse(data);
//     for (const history of jsonData) {
//       // 儲存資料到MongoDB
//       const newStockAlert = new stockAlert(history);
//       await newStockAlert.save();
//     }
//   }
//   console.log('資料處理完畢');
// })();

// (async () => {
//   const files = fs.readdirSync('../../jsons')
//   for (const file of files) {
//     console.log(`正在處理檔案 ${file}`);
//     const data = fs.readFileSync(`../../jsons/${file}`, 'utf8')
//     const jsonData = JSON.parse(data);
//     for (const history of jsonData) {
//       // 儲存資料到MongoDB
//       const exist = await stockBasic.findOne({id: history.id});
//       if (exist) {
//         continue;
//       }
//       const newStockBasic = new stockBasic(history);
//       await newStockBasic.save();
//     }
//   }
//   console.log('資料處理完畢');
// })();