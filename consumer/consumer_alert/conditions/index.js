const { bbandDownCross, bbandUpCross, bbandDownCrossMiddle, bbandUpCrossMiddle } = require('./bband.condition');
const { kdUpCross, kdDiffUpCross, kdDiffDownCross, kdDownCross } = require('./kd.condition');
const { smaUpCross, smaDownCross, smaShortUpCrossLong, smaShortDownCrossLong } = require('./sma.condition');
const config = require('../config/condition.config');
const { roundToN } = require('../utils/number.util');
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
  const condition1 = await kdUpCross({price: stock.price, fastK: config.kdUpCross.params.fastK, slowK: config.kdUpCross.slowK, slowD: config.kdUpCross.slowD});
  const condition2 = await kdDiffUpCross({price: stock.price, diff: config.kdDiffUpCross.params.diff, fastK: config.kdDiffUpCross.params.fastK, slowK: config.kdDiffUpCross.params.slowK, slowD: config.kdDiffUpCross.params.slowD});
  const condition3 = await kdDiffDownCross({ price: stock.price, diff: config.kdDiffDownCross.params.diff, fastK: config.kdDiffDownCross.params.fastK, slowK: config.kdDiffDownCross.params.slowK, slowD: config.kdDiffDownCross.params.slowD });
  const condition4 = await kdDownCross({ price: stock.price, fastK: config.kdDownCross.params.fastK, slowK: config.kdDownCross.params.slowK, slowD: config.kdDownCross.params.slowD });
  const condition5 = await smaUpCross({ price: stock.price, period: config.smaUpCross.params.period, diff: config.smaUpCross.params.diff });
  const condition6 = await smaDownCross({ price: stock.price, period: config.smaDownCross.params.period, diff: config.smaDownCross.params.diff });
  const condition7 = await smaShortUpCrossLong({ price: stock.price, shortPeriod: config.smaShortUpCrossLong.params.shortPeriod, longPeriod: config.smaShortUpCrossLong.params.longPeriod, diff: config.smaShortUpCrossLong.params.diff });
  const condition8 = await smaShortDownCrossLong({ price: stock.price, shortPeriod: config.smaShortDownCrossLong.params.shortPeriod, longPeriod: config.smaShortDownCrossLong.params.longPeriod, diff: config.smaShortDownCrossLong.params.diff });
  const condition9 = await bbandDownCross({ price: stock.price, period: config.bbandDownCross.params.period, std: config.bbandDownCross.params.std, diff: config.bbandDownCross.params.diff });
  const condition10 = await bbandUpCross({ price: stock.price, period: config.bbandUpCross.params.period, std: config.bbandUpCross.params.std, diff: config.bbandUpCross.params.diff });
  const condition11 = await bbandDownCrossMiddle({ price: stock.price, period: config.bbandDownCrossMiddle.params.period, std: config.bbandDownCrossMiddle.params.std, diff: config.bbandDownCrossMiddle.params.diff });
  const condition12 = await bbandUpCrossMiddle({ price: stock.price, period: config.bbandUpCrossMiddle.params.period, std: config.bbandUpCrossMiddle.params.std, diff: config.bbandUpCrossMiddle.params.diff });
  const price = stock.price.close[stock.price.close.length-1];
  
  // TODO: 對於第一次就觸發的條件，做一些處理
  // TODO: 對log內容做一修改，讓他更好閱讀
  if (condition1.result) {
    triggered[stock.stock]['kdUpCross'] = true;
    alertOnceLogger.info(`${stock.stock} kdUpCross, price: ${price}, K: ${roundToN(condition1.lastK, 2)}, D: ${roundToN(condition1.lastD, 2)}`);
  };
  if (condition2.result) {
    triggered[stock.stock]['kdDiffUpCross'] = true;
    alertOnceLogger.info(`${stock.stock} kdDiffUpCross, price: ${price}, K: ${roundToN(condition2.lastK, 2)}, D: ${roundToN(condition2.lastD, 2)}`);
  };
  if (condition3.result) {
    triggered[stock.stock]['kdDiffDownCross'] = true;
    alertOnceLogger.info(`${stock.stock} kdDiffDownCross, price: ${price}, K: ${roundToN(condition3.lastK, 2)}, D: ${roundToN(condition3.lastD, 2)}`);
  };
  if (condition4.result) {
    triggered[stock.stock]['kdDownCross'] = true;
    alertOnceLogger.info(`${stock.stock} kdDownCross, price: ${price}, K: ${roundToN(condition4.lastK, 2)}, D: ${roundToN(condition4.lastD, 2)}`);
  };
  if (condition5.result) {
    triggered[stock.stock]['smaUpCross'] = true;
    alertOnceLogger.info(`${stock.stock} smaUpCross, price: ${price}, SMA: ${roundToN(condition5.lastSMA, 2)}`);
  };
  if (condition6.result) {
    triggered[stock.stock]['smaDownCross'] = true;
    alertOnceLogger.info(`${stock.stock} smaDownCross, price: ${price}, SMA: ${roundToN(condition6.lastSMA, 2)}`);
  };
  if (condition7.result) {
    triggered[stock.stock]['smaShortUpCrossLong'] = true;
    alertOnceLogger.info(`${stock.stock} smaShortUpCrossLong, price: ${price}, SMA_short: ${roundToN(condition7.shortSMA, 2)}, SMA_long: ${roundToN(condition7.longSMA, 2)}`);
  };
  if (condition8.result) {
    triggered[stock.stock]['smaShortDownCrossLong'] = true;
    alertOnceLogger.info(`${stock.stock} smaShortDownCrossLong, price: ${price}, SMA_short: ${roundToN(condition8.shortSMA, 2)}, SMA_long: ${roundToN(condition8.longSMA, 2)}`);
  };
  if (condition9.result) {
    triggered[stock.stock]['bbandDownCross'] = true;
    alertOnceLogger.info(`${stock.stock} bbandDownCross, price: ${price}, bband: ${roundToN(condition9.lastLowerBand, 2)}`);
  };
  if (condition10.result) {
    triggered[stock.stock]['bbandUpCross'] = true;
    alertOnceLogger.info(`${stock.stock} bbandUpCross, price: ${price}, bband: ${roundToN(condition10.lastUpperBand, 2)}`);
  };
  if (condition11.result) {
    triggered[stock.stock]['bbandDownCrossMiddle'] = true;
    alertOnceLogger.info(`${stock.stock} bbandDownCrossMiddle, price: ${price}, bband: ${roundToN(condition11.lastMiddleBand, 2)}`);
  };
  if (condition12.result) {
    triggered[stock.stock]['bbandUpCrossMiddle'] = true;
    alertOnceLogger.info(`${stock.stock} bbandUpCrossMiddle, price: ${price}, bband: ${roundToN(condition12.lastMiddleBand, 2)}`);
  };
}

// 24小時內只會觸發一次
const alert = async (stock) => {
  const condition1 = await kdUpCross({price: stock.price, fastK: config.kdUpCross.params.fastK, slowK: config.kdUpCross.slowK, slowD: config.kdUpCross.slowD});
  const condition2 = await kdDiffUpCross({price: stock.price, diff: config.kdDiffUpCross.params.diff, fastK: config.kdDiffUpCross.params.fastK, slowK: config.kdDiffUpCross.params.slowK, slowD: config.kdDiffUpCross.params.slowD});
  const condition3 = await kdDiffDownCross({ price: stock.price, diff: config.kdDiffDownCross.params.diff, fastK: config.kdDiffDownCross.params.fastK, slowK: config.kdDiffDownCross.params.slowK, slowD: config.kdDiffDownCross.params.slowD });
  const condition4 = await kdDownCross({ price: stock.price, fastK: config.kdDownCross.params.fastK, slowK: config.kdDownCross.params.slowK, slowD: config.kdDownCross.params.slowD });
  const condition5 = await smaUpCross({ price: stock.price, period: config.smaUpCross.params.period, diff: config.smaUpCross.params.diff });
  const condition6 = await smaDownCross({ price: stock.price, period: config.smaDownCross.params.period, diff: config.smaDownCross.params.diff });
  const condition7 = await smaShortUpCrossLong({ price: stock.price, shortPeriod: config.smaShortUpCrossLong.params.shortPeriod, longPeriod: config.smaShortUpCrossLong.params.longPeriod, diff: config.smaShortUpCrossLong.params.diff });
  const condition8 = await smaShortDownCrossLong({ price: stock.price, shortPeriod: config.smaShortDownCrossLong.params.shortPeriod, longPeriod: config.smaShortDownCrossLong.params.longPeriod, diff: config.smaShortDownCrossLong.params.diff });
  const condition9 = await bbandDownCross({ price: stock.price, period: config.bbandDownCross.params.period, std: config.bbandDownCross.params.std, diff: config.bbandDownCross.params.diff });
  const condition10 = await bbandUpCross({ price: stock.price, period: config.bbandUpCross.params.period, std: config.bbandUpCross.params.std, diff: config.bbandUpCross.params.diff });
  const condition11 = await bbandDownCrossMiddle({ price: stock.price, period: config.bbandDownCrossMiddle.params.period, std: config.bbandDownCrossMiddle.params.std, diff: config.bbandDownCrossMiddle.params.diff });
  const condition12 = await bbandUpCrossMiddle({ price: stock.price, period: config.bbandUpCrossMiddle.params.period, std: config.bbandUpCrossMiddle.params.std, diff: config.bbandUpCrossMiddle.params.diff });
  const price = stock.price.close[stock.price.close.length-1];

  // TODO: 對於之後觸發的條件，做一些處理
  // TODO: 對log內容做一修改，讓他更好閱讀
  if (condition1.result) {
    triggered[stock.stock]['kdUpCross'] = true;
    alertOnceLogger.info(`${stock.stock} kdUpCross, price: ${price}, K: ${roundToN(condition1.lastK, 2)}, D: ${roundToN(condition1.lastD, 2)}`);
  };
  if (condition2.result) {
    triggered[stock.stock]['kdDiffUpCross'] = true;
    alertOnceLogger.info(`${stock.stock} kdDiffUpCross, price: ${price}, K: ${roundToN(condition2.lastK, 2)}, D: ${roundToN(condition2.lastD, 2)}`);
  };
  if (condition3.result) {
    triggered[stock.stock]['kdDiffDownCross'] = true;
    alertOnceLogger.info(`${stock.stock} kdDiffDownCross, price: ${price}, K: ${roundToN(condition3.lastK, 2)}, D: ${roundToN(condition3.lastD, 2)}`);
  };
  if (condition4.result) {
    triggered[stock.stock]['kdDownCross'] = true;
    alertOnceLogger.info(`${stock.stock} kdDownCross, price: ${price}, K: ${roundToN(condition4.lastK, 2)}, D: ${roundToN(condition4.lastD, 2)}`);
  };
  if (condition5.result) {
    triggered[stock.stock]['smaUpCross'] = true;
    alertOnceLogger.info(`${stock.stock} smaUpCross, price: ${price}, SMA: ${roundToN(condition5.lastSMA, 2)}`);
  };
  if (condition6.result) {
    triggered[stock.stock]['smaDownCross'] = true;
    alertOnceLogger.info(`${stock.stock} smaDownCross, price: ${price}, SMA: ${roundToN(condition6.lastSMA, 2)}`);
  };
  if (condition7.result) {
    triggered[stock.stock]['smaShortUpCrossLong'] = true;
    alertOnceLogger.info(`${stock.stock} smaShortUpCrossLong, price: ${price}, SMA_short: ${roundToN(condition7.shortSMA, 2)}, SMA_long: ${roundToN(condition7.longSMA, 2)}`);
  };
  if (condition8.result) {
    triggered[stock.stock]['smaShortDownCrossLong'] = true;
    alertOnceLogger.info(`${stock.stock} smaShortDownCrossLong, price: ${price}, SMA_short: ${roundToN(condition8.shortSMA, 2)}, SMA_long: ${roundToN(condition8.longSMA, 2)}`);
  };
  if (condition9.result) {
    triggered[stock.stock]['bbandDownCross'] = true;
    alertOnceLogger.info(`${stock.stock} bbandDownCross, price: ${price}, bband: ${roundToN(condition9.lastLowerBand, 2)}`);
  };
  if (condition10.result) {
    triggered[stock.stock]['bbandUpCross'] = true;
    alertOnceLogger.info(`${stock.stock} bbandUpCross, price: ${price}, bband: ${roundToN(condition10.lastUpperBand, 2)}`);
  };
  if (condition11.result) {
    triggered[stock.stock]['bbandDownCrossMiddle'] = true;
    alertOnceLogger.info(`${stock.stock} bbandDownCrossMiddle, price: ${price}, bband: ${roundToN(condition11.lastMiddleBand, 2)}`);
  };
  if (condition12.result) {
    triggered[stock.stock]['bbandUpCrossMiddle'] = true;
    alertOnceLogger.info(`${stock.stock} bbandUpCrossMiddle, price: ${price}, bband: ${roundToN(condition12.lastMiddleBand, 2)}`);
  };
}

module.exports = {
  alertOnce,
  alert
}