const { bbandDownCross, bbandUpCross, bbandDownCrossMiddle, bbandUpCrossMiddle } = require('./bband.condition');
const { kdUpCross, kdDiffUpCross, kdDiffDownCross, kdDownCross } = require('./kd.condition');
const { smaUpCross, smaDownCross, smaShortUpCrossLong, smaShortDownCrossLong } = require('./sma.condition');
const log4js = require('log4js');
log4js.configure({
  appenders: { 
    stock_alert: { type: "file", filename: "./log/stock_alert.log" } ,
    stock_alert_once: { type: "file", filename: "./log/stock_alert_once.log" }
  },
  categories: { 
    default: { appenders: ["stock_alert"], level: "info" },
    stock_alert: { appenders: ["stock_alert"], level: "info" },
    stock_alert_once: { appenders: ["stock_alert_once"], level: "info" }
  }
});
const alertLogger = log4js.getLogger("stock_alert");
const alertOnceLogger = log4js.getLogger("stock_alert_once");

// 每個條件一天只能觸發一次
let triggered = require('../json/triggered.json');

// 每天只會執行一次，而且是第一個執行
const alertOnce = async (stock) => {
  const condition1 = await kdUpCross({price: stock.price, fastK: 9, slowK: 3, slowD: 3});
  const condition2 = await kdDiffUpCross({price: stock.price, diff: 3, fastK: 9, slowK: 3, slowD: 3});
  const condition3 = await kdDiffDownCross({ price: stock.price, diff: 3, fastK: 9, slowK: 3, slowD: 3 });
  const condition4 = await kdDownCross({ price: stock.price, fastK: 9, slowK: 3, slowD: 3 });
  const condition5 = await smaUpCross({ price: stock.price, period: 5 });
  const condition6 = await smaDownCross({ price: stock.price, period: 5 });
  const condition7 = await smaShortUpCrossLong({ price: stock.price, shortPeriod: 5, longPeriod: 10 });
  const condition8 = await smaShortDownCrossLong({ price: stock.price, shortPeriod: 5, longPeriod: 10 });
  const condition9 = await bbandDownCross({ price: stock.price, period: 5, NumOfDev: 2 });
  const condition10 = await bbandUpCross({ price: stock.price, period: 5, NumOfDev: 2 });
  const condition11 = await bbandDownCrossMiddle({ price: stock.price, period: 5, NumOfDev: 2 });
  const condition12 = await bbandUpCrossMiddle({ price: stock.price, period: 5, NumOfDev: 2 });
  
  // TODO: 對於第一次就觸發的條件，做一些處理
  if (condition1.result) {
    triggered[stock.stock]['kdUpCross'] = true;
    alertOnceLogger.info(`${stock.stock} kdUpCross, price: ${stock.price}, K: ${condition1.lastK}, D: ${condition1.lastD}`);
  };
  if (condition2.result) {
    triggered[stock.stock]['kdDiffUpCross'] = true;
    alertOnceLogger.info(`${stock.stock} kdDiffUpCross, price: ${stock.price}, K: ${condition2.lastK}, D: ${condition2.lastD}`);
  };
  if (condition3.result) {
    triggered[stock.stock]['kdDiffDownCross'] = true;
    alertOnceLogger.info(`${stock.stock} kdDiffDownCross, price: ${stock.price}, K: ${condition3.lastK}, D: ${condition3.lastD}`);
  };
  if (condition4.result) {
    triggered[stock.stock]['kdDownCross'] = true;
    alertOnceLogger.info(`${stock.stock} kdDownCross, price: ${stock.price}, K: ${condition4.lastK}, D: ${condition4.lastD}`);
  };
  if (condition5.result) {
    triggered[stock.stock]['smaUpCross'] = true;
    alertOnceLogger.info(`${stock.stock} smaUpCross, price: ${stock.price}, price: ${stock.price}, SMA: ${condition5.lastSMA}`);
  };
  if (condition6.result) {
    triggered[stock.stock]['smaDownCross'] = true;
    alertOnceLogger.info(`${stock.stock} smaDownCross, price: ${stock.price}, price: ${stock.price}, SMA: ${condition6.lastSMA}`);
  };
  if (condition7.result) {
    triggered[stock.stock]['smaShortUpCrossLong'] = true;
    alertOnceLogger.info(`${stock.stock} smaShortUpCrossLong, price: ${stock.price}, price: ${stock.price}, SMA_short: ${condition7.shortSMA}, SMA_long: ${condition7.longSMA}`);
  };
  if (condition8.result) {
    triggered[stock.stock]['smaShortDownCrossLong'] = true;
    alertOnceLogger.info(`${stock.stock} smaShortDownCrossLong, price: ${stock.price}, price: ${stock.price}, SMA_short: ${condition8.shortSMA}, SMA_long: ${condition8.longSMA}`);
  };
  if (condition9.result) {
    triggered[stock.stock]['bbandDownCross'] = true;
    alertOnceLogger.info(`${stock.stock} bbandDownCross, price: ${stock.price}, price: ${stock.price}, bband: ${condition9.lastLowerBand}`);
  };
  if (condition10.result) {
    triggered[stock.stock]['bbandUpCross'] = true;
    alertOnceLogger.info(`${stock.stock} bbandUpCross, price: ${stock.price}, price: ${stock.price}, bband: ${condition10.lastUpperBand}`);
  };
  if (condition11.result) {
    triggered[stock.stock]['bbandDownCrossMiddle'] = true;
    alertOnceLogger.info(`${stock.stock} bbandDownCrossMiddle, price: ${stock.price}, price: ${stock.price}, bband: ${condition11.lastMiddleBand}`);
  };
  if (condition12.result) {
    triggered[stock.stock]['bbandUpCrossMiddle'] = true;
    alertOnceLogger.info(`${stock.stock} bbandUpCrossMiddle, price: ${stock.price}, price: ${stock.price}, bband: ${condition12.lastMiddleBand}`);
  };
}

const alert = async (stock) => {
  const condition1 = await kdUpCross({price: stock.price, fastK: 9, slowK: 3, slowD: 3});
  const condition2 = await kdDiffUpCross({price: stock.price, diff: 3, fastK: 9, slowK: 3, slowD: 3});
  const condition3 = await kdDiffDownCross({ price: stock.price, diff: 3, fastK: 9, slowK: 3, slowD: 3 });
  const condition4 = await kdDownCross({ price: stock.price, fastK: 9, slowK: 3, slowD: 3 });
  const condition5 = await smaUpCross({ price: stock.price, period: 5 });
  const condition6 = await smaDownCross({ price: stock.price, period: 5 });
  const condition7 = await smaShortUpCrossLong({ price: stock.price, shortPeriod: 5, longPeriod: 10 });
  const condition8 = await smaShortDownCrossLong({ price: stock.price, shortPeriod: 5, longPeriod: 10 });
  const condition9 = await bbandDownCross({ price: stock.price, period: 5, NumOfDev: 2 });
  const condition10 = await bbandUpCross({ price: stock.price, period: 5, NumOfDev: 2 });
  const condition11 = await bbandDownCrossMiddle({ price: stock.price, period: 5, NumOfDev: 2 });
  const condition12 = await bbandUpCrossMiddle({ price: stock.price, period: 5, NumOfDev: 2 });

  if (condition1.result) triggered[stock.stock]['kdUpCross'] = true;
  if (condition2.result) triggered[stock.stock]['kdDiffUpCross'] = true;
  if (condition3.result) triggered[stock.stock]['kdDiffDownCross'] = true;
  if (condition4.result) triggered[stock.stock]['kdDownCross'] = true;
  if (condition5.result) triggered[stock.stock]['smaUpCross'] = true;
  if (condition6.result) triggered[stock.stock]['smaDownCross'] = true;
  if (condition7.result) triggered[stock.stock]['smaShortUpCrossLong'] = true;
  if (condition8.result) triggered[stock.stock]['smaShortDownCrossLong'] = true;
  if (condition9.result) triggered[stock.stock]['bbandDownCross'] = true;
  if (condition10.result) triggered[stock.stock]['bbandUpCross'] = true;
  if (condition11.result) triggered[stock.stock]['bbandDownCrossMiddle'] = true;
  if (condition12.result) triggered[stock.stock]['bbandUpCrossMiddle'] = true;

  // TODO: 對於之後觸發的條件，做一些處理
}

module.exports = {
  alertOnce,
  alert
}