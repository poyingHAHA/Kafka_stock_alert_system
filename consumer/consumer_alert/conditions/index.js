const { bbandDownCross, bbandUpCross, bbandDownCrossMiddle, bbandUpCrossMiddle } = require('./bband.condition');
const { kdUpCross, kdDiffUpCross, kdDiffDownCross, kdDownCross } = require('./kd.condition');
const { smaUpCross, smaDownCross, smaShortUpCrossLong, smaShortDownCrossLong } = require('./sma.condition');
const config = require('../config/condition.config');
const { roundToN } = require('../utils/number.util');
const { sendLineMsg } = require('../utils/line.util');
const produceFront = require('../producer/producer_front');
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

// 每個條件一天只能觸發一次, 用來記錄已經觸發過的條件, 避免重複觸發。每日00:00會清空
let triggered = require('../json/triggered.json');

// 每天只會執行一次，而且是第一個執行, 用來記錄已經達成的條件, 避免重複執行。
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
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'kdUpCross',
      msg: 'K值向上穿越D值',
      lastK: roundToN(condition1.lastK, 2),
      lastD: roundToN(condition1.lastD, 2),
      up: config.kdUpCross.up,
      timestamp: stock.timestamp,
      init: true // 是否一開始就觸發
    })
    alertOnceLogger.info(`${stock.stock} kdUpCross, price: ${price}, K: ${roundToN(condition1.lastK, 2)}, D: ${roundToN(condition1.lastD, 2)}, 是否看漲：${config.kdUpCross.up ? '是' : '否'}`);
  };
  if (condition2.result) {
    triggered[stock.stock]['kdDiffUpCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'kdDiffUpCross',
      msg: 'K值即將向上穿越D值',
      lastK: roundToN(condition2.lastK, 2),
      lastD: roundToN(condition2.lastD, 2),
      diff: config.kdDiffUpCross.params.diff,
      up: config.kdDiffUpCross.up,
      timestamp: stock.timestamp,
      init: true // 是否一開始就觸發
    })
    alertOnceLogger.info(`${stock.stock} kdDiffUpCross, price: ${price}, K: ${roundToN(condition2.lastK, 2)}, D: ${roundToN(condition2.lastD, 2)}, 是否看漲：${config.kdDiffUpCross.up ? '是' : '否'}`);
  };
  if (condition3.result) {
    triggered[stock.stock]['kdDiffDownCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'kdDiffDownCross',
      msg: 'K值即將向下穿越D值',
      lastK: roundToN(condition3.lastK, 2),
      lastD: roundToN(condition3.lastD, 2),
      diff: config.kdDiffDownCross.params.diff,
      up: config.kdDiffDownCross.up,
      timestamp: stock.timestamp,
      init: true // 是否一開始就觸發
    })
    alertOnceLogger.info(`${stock.stock} kdDiffDownCross, price: ${price}, K: ${roundToN(condition3.lastK, 2)}, D: ${roundToN(condition3.lastD, 2)}, 是否看漲：${config.kdDiffDownCross.up ? '是' : '否'}`);
  };
  if (condition4.result) {
    triggered[stock.stock]['kdDownCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'kdDownCross',
      msg: 'K值向下穿越D值',
      lastK: roundToN(condition4.lastK, 2),
      lastD: roundToN(condition4.lastD, 2),
      up: config.kdDownCross.up,
      timestamp: stock.timestamp,
      init: true // 是否一開始就觸發
    })

    alertOnceLogger.info(`${stock.stock} kdDownCross, price: ${price}, K: ${roundToN(condition4.lastK, 2)}, D: ${roundToN(condition4.lastD, 2)}`, `是否看漲：${config.kdDownCross.up ? '是' : '否'}`);
  };
  if (condition5.result) {
    triggered[stock.stock]['smaUpCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'smaUpCross',
      msg: `股價向上穿越${config.smaUpCross.params.sma}日均線`,
      lastSMA: roundToN(condition5.lastSMA, 2),
      diff: config.smaUpCross.params.diff,
      up: config.smaUpCross.up,
      timestamp: stock.timestamp,
      init: true // 是否一開始就觸發
    })
    alertOnceLogger.info(`${stock.stock} smaUpCross, price: ${price}, SMA: ${roundToN(condition5.lastSMA, 2)}, 是否看漲：${config.smaUpCross.up ? '是' : '否'}`);
  };
  if (condition6.result) {
    triggered[stock.stock]['smaDownCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'smaDownCross',
      msg: `股價向下穿越${config.smaDownCross.params.period}日均線`,
      lastSMA: roundToN(condition6.lastSMA, 2),
      diff: config.smaDownCross.params.diff,
      up: config.smaDownCross.up,
      timestamp: stock.timestamp,
      init: true // 是否一開始就觸發
    })
    alertOnceLogger.info(`${stock.stock} smaDownCross, price: ${price}, SMA: ${roundToN(condition6.lastSMA, 2)}, 是否看漲：${config.smaDownCross.up ? '是' : '否'}`);
  };
  if (condition7.result) {
    triggered[stock.stock]['smaShortUpCrossLong'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'smaShortUpCrossLong',
      msg: `${config.smaShortUpCrossLong.params.shortPeriod}日均線向上穿越${config.smaShortUpCrossLong.params.longPeriod}日均線`,
      shortSMA: roundToN(condition7.shortSMA, 2),
      longSMA: roundToN(condition7.longSMA, 2),
      diff: config.smaShortUpCrossLong.params.diff,
      up: config.smaShortUpCrossLong.up,
      timestamp: stock.timestamp,
      init: true // 是否一開始就觸發
    })
    alertOnceLogger.info(`${stock.stock} smaShortUpCrossLong, price: ${price}, SMA_short: ${roundToN(condition7.shortSMA, 2)}, SMA_long: ${roundToN(condition7.longSMA, 2)}, 是否看漲：${config.smaShortUpCrossLong.up ? '是' : '否'}`);
  };
  if (condition8.result) {
    triggered[stock.stock]['smaShortDownCrossLong'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'smaShortDownCrossLong',
      msg: `${config.smaShortDownCrossLong.params.shortPeriod}日均線向下穿越${config.smaShortDownCrossLong.params.longPeriod}日均線`,
      shortSMA: roundToN(condition8.shortSMA, 2),
      longSMA: roundToN(condition8.longSMA, 2),
      diff: config.smaShortDownCrossLong.params.diff,
      up: config.smaShortDownCrossLong.up,
      timestamp: stock.timestamp,
      init: true // 是否一開始就觸發
    })
    alertOnceLogger.info(`${stock.stock} smaShortDownCrossLong, price: ${price}, SMA_short: ${roundToN(condition8.shortSMA, 2)}, SMA_long: ${roundToN(condition8.longSMA, 2)}, 是否看漲：${config.smaShortDownCrossLong.up ? '是' : '否'}`);
  };
  if (condition9.result) {
    triggered[stock.stock]['bbandDownCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'bbandDownCross',
      msg: `${config.bbandDownCross.params.period}日Bollinger Band下軌`,
      Lowbband: roundToN(condition9.lastLowerBand, 2),
      diff: config.bbandDownCross.params.diff,
      std: config.bbandDownCross.params.std,
      up: config.bbandDownCross.up,
      timestamp: stock.timestamp,
      init: true // 是否一開始就觸發
    })
    alertOnceLogger.info(`${stock.stock} bbandDownCross, price: ${price}, bband: ${roundToN(condition9.lastLowerBand, 2)}, 是否看漲：${config.bbandDownCross.up ? '是' : '否'}`);
  };
  if (condition10.result) {
    triggered[stock.stock]['bbandUpCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'bbandUpCross',
      msg: `股價向上穿越${config.bbandUpCross.params.period}日Bollinger Band上軌`,
      Upbband: roundToN(condition10.lastUpperBand, 2),
      diff: config.bbandUpCross.params.diff,
      std: config.bbandUpCross.params.std,
      up: config.bbandUpCross.up,
      timestamp: stock.timestamp,
      init: true // 是否一開始就觸發
    })
    alertOnceLogger.info(`${stock.stock} bbandUpCross, price: ${price}, bband: ${roundToN(condition10.lastUpperBand, 2)}, 是否看漲：${config.bbandUpCross.up ? '是' : '否'}`);
  };
  if (condition11.result) {
    triggered[stock.stock]['bbandDownCrossMiddle'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'bbandDownCrossMiddle',
      msg: `股價向下穿越${config.bbandDownCrossMiddle.params.period}日Bollinger Band中軌`,
      Middlebband: roundToN(condition11.lastMiddleBand, 2),
      diff: config.bbandDownCrossMiddle.params.diff,
      std: config.bbandDownCrossMiddle.params.std,
      up: config.bbandDownCrossMiddle.up,
      timestamp: stock.timestamp,
      init: true // 是否一開始就觸發
    })
    alertOnceLogger.info(`${stock.stock} bbandDownCrossMiddle, price: ${price}, bband: ${roundToN(condition11.lastMiddleBand, 2)}, 是否看漲：${config.bbandDownCrossMiddle.up ? '是' : '否'}`);
  };
  if (condition12.result) {
    triggered[stock.stock]['bbandUpCrossMiddle'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'bbandUpCrossMiddle',
      msg: `股價向上穿越${config.bbandUpCrossMiddle.params.period}日Bollinger Band中軌`,
      Middlebband: roundToN(condition12.lastMiddleBand, 2),
      diff: config.bbandUpCrossMiddle.params.diff,
      std: config.bbandUpCrossMiddle.params.std,
      up: config.bbandUpCrossMiddle.up,
      timestamp: stock.timestamp,
      init: false // 是否一開始就觸發
    })
    alertOnceLogger.info(`${stock.stock} bbandUpCrossMiddle, price: ${price}, bband: ${roundToN(condition12.lastMiddleBand, 2)}`, `是否看漲：${config.bbandUpCrossMiddle.up ? '是' : '否'}`);
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
  if (condition1.result && !triggered[stock.stock]['kdUpCross']) {
    triggered[stock.stock]['kdUpCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'kdUpCross',
      msg: 'K值向上穿越D值',
      lastK: roundToN(condition1.lastK, 2),
      lastD: roundToN(condition1.lastD, 2),
      up: config.kdUpCross.up,
      timestamp: stock.timestamp,
      init: false // 是否一開始就觸發
    })

    // line message
    const lineMessage = `\n股票代號: ${stock.stock}
產業別: ${stock.industry}
條件: K值向上穿越D值
股價: ${price}
${config.kdUpCross.params.fastK}日K: ${roundToN(condition1.lastK, 2)}
${config.kdUpCross.params.slowD}日D: ${roundToN(condition1.lastD, 2)}
是否看漲：${config.kdUpCross.up ? '是' : '否'}`;
    sendLineMsg(lineMessage);

    alertLogger.info(`${stock.stock} kdUpCross, price: ${price}, K: ${roundToN(condition1.lastK, 2)}, D: ${roundToN(condition1.lastD, 2)}, 是否看漲：${config.kdUpCross.up ? '是' : '否'}`);
  };
  if (condition2.result && !triggered[stock.stock]['kdDiffUpCross']) { // kdDiffUpCross
    triggered[stock.stock]['kdDiffUpCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'kdDiffUpCross',
      msg: 'K值即將向上穿越D值',
      lastK: roundToN(condition2.lastK, 2),
      lastD: roundToN(condition2.lastD, 2),
      diff: config.kdDiffUpCross.params.diff,
      up: config.kdDiffUpCross.up,
      timestamp: stock.timestamp,
      init: false // 是否一開始就觸發
    })

    // line message
    const lineMessage = `\n股票代號: ${stock.stock}
產業別: ${stock.industry}
條件: K值即將向上穿越D值
設定差值: ${config.kdDiffUpCross.params.diff}
股價: ${price}
${config.kdDiffUpCross.params.fastK}日K: ${roundToN(condition2.lastK, 2)}
${config.kdDiffUpCross.params.slowD}日D: ${roundToN(condition2.lastD, 2)}
是否看漲：${config.kdDiffUpCross.up ? '是' : '否'}`;
    sendLineMsg(lineMessage);

    alertLogger.info(`${stock.stock} kdDiffUpCross, price: ${price}, K: ${roundToN(condition2.lastK, 2)}, D: ${roundToN(condition2.lastD, 2)}, 是否看漲：${config.kdDiffUpCross.up ? '是' : '否'}`);
  };
  if (condition3.result && !triggered[stock.stock]['kdDiffDownCross']) { // kdDiffDownCross
    triggered[stock.stock]['kdDiffDownCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'kdDiffDownCross',
      msg: 'K值即將向下穿越D值',
      lastK: roundToN(condition3.lastK, 2),
      lastD: roundToN(condition3.lastD, 2),
      diff: config.kdDiffDownCross.params.diff,
      up: config.kdDiffDownCross.up,
      timestamp: stock.timestamp,
      init: false // 是否一開始就觸發
    })

    // line message
    const lineMessage = `\n股票代號: ${stock.stock}
產業別: ${stock.industry}
條件: K值即將向下穿越D值
設定差值: ${config.kdDiffDownCross.params.diff}
股價: ${price}
${config.kdDiffDownCross.params.fastK}日K: ${roundToN(condition3.lastK, 2)}
${config.kdDiffDownCross.params.slowD}日D: ${roundToN(condition3.lastD, 2)}
是否看漲：${config.kdDiffDownCross.up ? '是' : '否'}`;
    sendLineMsg(lineMessage);

    alertLogger.info(`${stock.stock} kdDiffDownCross, price: ${price}, K: ${roundToN(condition3.lastK, 2)}, D: ${roundToN(condition3.lastD, 2)}, 是否看漲：${config.kdDiffDownCross.up ? '是' : '否'}`);
  };
  if (condition4.result && !triggered[stock.stock]['kdDownCross']) { // kdDownCross
    triggered[stock.stock]['kdDownCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'kdDownCross',
      msg: 'K值向下穿越D值',
      lastK: roundToN(condition4.lastK, 2),
      lastD: roundToN(condition4.lastD, 2),
      up: config.kdDownCross.up,
      timestamp: stock.timestamp,
      init: false // 是否一開始就觸發
    })

    // line message
    const lineMessage = `\n股票代號: ${stock.stock}
產業別: ${stock.industry}
條件: K值向下穿越D值
股價: ${price}
${config.kdDownCross.params.fastK}日K: ${roundToN(condition4.lastK, 2)}
${config.kdDownCross.params.slowD}日D: ${roundToN(condition4.lastD, 2)}
是否看漲：${config.kdDownCross.up ? '是' : '否'}`;
    sendLineMsg(lineMessage);

    alertLogger.info(`${stock.stock} kdDownCross, price: ${price}, K: ${roundToN(condition4.lastK, 2)}, D: ${roundToN(condition4.lastD, 2)}`, `是否看漲：${config.kdDownCross.up ? '是' : '否'}`);
  };
  if (condition5.result && !triggered[stock.stock]['smaUpCross']) { // smaUpCross
    triggered[stock.stock]['smaUpCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'smaUpCross',
      msg: `股價向上穿越${config.smaUpCross.params.sma}日均線`,
      lastSMA: roundToN(condition5.lastSMA, 2),
      diff: config.smaUpCross.params.diff,
      up: config.smaUpCross.up,
      timestamp: stock.timestamp,
      init: false // 是否一開始就觸發
    })
    // line message
    const lineMessage = `\n股票代號: ${stock.stock}
產業別: ${stock.industry}
條件: 股價向上穿越${config.smaUpCross.params.sma}日均線
設定差值: ${config.smaUpCross.params.diff}
股價: ${price} 
${config.smaUpCross.params.period}日均線: ${roundToN(condition5.lastSMA, 2)}
是否看漲：${config.smaUpCross.up ? '是' : '否'}`;
    sendLineMsg(lineMessage);

    alertLogger.info(`${stock.stock} smaUpCross, price: ${price}, SMA: ${roundToN(condition5.lastSMA, 2)}, 是否看漲：${config.smaUpCross.up ? '是' : '否'}`);
  };
  if (condition6.result && !triggered[stock.stock]['smaDownCross']) { // smaDownCross
    triggered[stock.stock]['smaDownCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'smaDownCross',
      msg: `股價向下穿越${config.smaDownCross.params.period}日均線`,
      lastSMA: roundToN(condition6.lastSMA, 2),
      diff: config.smaDownCross.params.diff,
      up: config.smaDownCross.up,
      timestamp: stock.timestamp,
      init: false // 是否一開始就觸發
    })
    // line message
    const lineMessage = `\n股票代號: ${stock.stock}
產業別: ${stock.industry}
條件: 股價向下穿越${config.smaDownCross.params.period}日均線
設定差值: ${config.smaDownCross.params.diff}
股價: ${price}
${config.smaDownCross.params.period}日均線: ${roundToN(condition6.lastSMA, 2)}
是否看漲：${config.smaDownCross.up ? '是' : '否'}`;
    sendLineMsg(lineMessage);

    alertLogger.info(`${stock.stock} smaDownCross, price: ${price}, SMA: ${roundToN(condition6.lastSMA, 2)}, 是否看漲：${config.smaDownCross.up ? '是' : '否'}`);
  };
  if (condition7.result && !triggered[stock.stock]['smaShortUpCrossLong']) { // smaShortUpCrossLong
    triggered[stock.stock]['smaShortUpCrossLong'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'smaShortUpCrossLong',
      msg: `${config.smaShortUpCrossLong.params.shortPeriod}日均線向上穿越${config.smaShortUpCrossLong.params.longPeriod}日均線`,
      shortSMA: roundToN(condition7.shortSMA, 2),
      longSMA: roundToN(condition7.longSMA, 2),
      diff: config.smaShortUpCrossLong.params.diff,
      up: config.smaShortUpCrossLong.up,
      timestamp: stock.timestamp,
      init: false // 是否一開始就觸發
    })
    // line message
    const lineMessage = `\n股票代號: ${stock.stock}
產業別: ${stock.industry}
條件: ${config.smaShortUpCrossLong.params.shortPeriod}日均線向上穿越${config.smaShortUpCrossLong.params.longPeriod}日均線
設定差值: ${config.smaShortUpCrossLong.params.diff}
股價: ${price}
${config.smaShortUpCrossLong.params.shortPeriod}日均線: ${roundToN(condition7.shortSMA, 2)}
${config.smaShortUpCrossLong.params.longPeriod}日均線: ${roundToN(condition7.longSMA, 2)}
是否看漲：${config.smaShortUpCrossLong.up ? '是' : '否'}`;
    sendLineMsg(lineMessage);

    alertLogger.info(`${stock.stock} smaShortUpCrossLong, price: ${price}, SMA_short: ${roundToN(condition7.shortSMA, 2)}, SMA_long: ${roundToN(condition7.longSMA, 2)}, 是否看漲：${config.smaShortUpCrossLong.up ? '是' : '否'}`);
  };
  if (condition8.result && !triggered[stock.stock]['smaShortDownCrossLong']) { // smaShortDownCrossLong
    triggered[stock.stock]['smaShortDownCrossLong'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'smaShortDownCrossLong',
      msg: `${config.smaShortDownCrossLong.params.shortPeriod}日均線向下穿越${config.smaShortDownCrossLong.params.longPeriod}日均線`,
      shortSMA: roundToN(condition8.shortSMA, 2),
      longSMA: roundToN(condition8.longSMA, 2),
      diff: config.smaShortDownCrossLong.params.diff,
      up: config.smaShortDownCrossLong.up,
      timestamp: stock.timestamp,
      init: false // 是否一開始就觸發
    })

    // line message
    const lineMessage = `\n股票代號: ${stock.stock}
產業別: ${stock.industry}
條件: ${config.smaShortDownCrossLong.params.shortPeriod}日均線向下穿越${config.smaShortDownCrossLong.params.longPeriod}日均線
設定差值: ${config.smaShortDownCrossLong.params.diff}
股價: ${price}
${config.smaShortDownCrossLong.params.shortPeriod}日均線: ${roundToN(condition8.shortSMA, 2)}
${config.smaShortDownCrossLong.params.longPeriod}日均線: ${roundToN(condition8.longSMA, 2)}
是否看漲：${config.smaShortDownCrossLong.up ? '是' : '否'}`;
    sendLineMsg(lineMessage);

    alertLogger.info(`${stock.stock} smaShortDownCrossLong, price: ${price}, SMA_short: ${roundToN(condition8.shortSMA, 2)}, SMA_long: ${roundToN(condition8.longSMA, 2)}, 是否看漲：${config.smaShortDownCrossLong.up ? '是' : '否'}`);
  };
  if (condition9.result && !triggered[stock.stock]['bbandDownCross']) { // bbandDownCross
    triggered[stock.stock]['bbandDownCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'bbandDownCross',
      msg: `${config.bbandDownCross.params.period}日Bollinger Band下軌`,
      Lowbband: roundToN(condition9.lastLowerBand, 2),
      diff: config.bbandDownCross.params.diff,
      std: config.bbandDownCross.params.std,
      up: config.bbandDownCross.up,
      timestamp: stock.timestamp,
      init: false // 是否一開始就觸發
    })
    // line message
    const lineMessage = `\n股票代號: ${stock.stock}
產業別: ${stock.industry}
條件: 股價向下穿越${config.bbandDownCross.params.period}日Bollinger Band下軌
設定差值: ${config.bbandDownCross.params.diff}
標準差: ${config.bbandDownCross.params.std}
股價: ${price}
${config.bbandDownCross.params.period}日Bollinger Band下軌: ${roundToN(condition9.lastLowerBand, 2)}
是否看漲：${config.bbandDownCross.up ? '是' : '否'}`;
    sendLineMsg(lineMessage);

    alertLogger.info(`${stock.stock} bbandDownCross, price: ${price}, bband: ${roundToN(condition9.lastLowerBand, 2)}, 是否看漲：${config.bbandDownCross.up ? '是' : '否'}`);
  };
  if (condition10.result && !triggered[stock.stock]['bbandUpCross']) { // bbandUpCross
    triggered[stock.stock]['bbandUpCross'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'bbandUpCross',
      msg: `股價向上穿越${config.bbandUpCross.params.period}日Bollinger Band上軌`,
      Upbband: roundToN(condition10.lastUpperBand, 2),
      diff: config.bbandUpCross.params.diff,
      std: config.bbandUpCross.params.std,
      up: config.bbandUpCross.up,
      timestamp: stock.timestamp,
      init: false // 是否一開始就觸發
    })
    // line message
    const lineMessage = `\n股票代號: ${stock.stock}
產業別: ${stock.industry}
條件: 股價向上穿越${config.bbandUpCross.params.period}日Bollinger Band上軌
設定差值: ${config.bbandUpCross.params.diff}
標準差: ${config.bbandUpCross.params.std}
股價: ${price}
${config.bbandUpCross.params.period}日Bollinger Band上軌: ${roundToN(condition10.lastUpperBand, 2)}
是否看漲：${config.bbandUpCross.up ? '是' : '否'}`;
    sendLineMsg(lineMessage);

    alertLogger.info(`${stock.stock} bbandUpCross, price: ${price}, bband: ${roundToN(condition10.lastUpperBand, 2)}, 是否看漲：${config.bbandUpCross.up ? '是' : '否'}`);
  };
  if (condition11.result && !triggered[stock.stock]['bbandDownCrossMiddle']) { // bbandDownCrossMiddle
    triggered[stock.stock]['bbandDownCrossMiddle'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'bbandDownCrossMiddle',
      msg: `股價向下穿越${config.bbandDownCrossMiddle.params.period}日Bollinger Band中軌`,
      Middlebband: roundToN(condition11.lastMiddleBand, 2),
      diff: config.bbandDownCrossMiddle.params.diff,
      std: config.bbandDownCrossMiddle.params.std,
      up: config.bbandDownCrossMiddle.up,
      timestamp: stock.timestamp,
      init: false // 是否一開始就觸發
    })
    // line message
    const lineMessage = `\n股票代號: ${stock.stock}
產業別: ${stock.industry}
條件: 股價向下穿越${config.bbandDownCrossMiddle.params.period}日Bollinger Band中軌
設定差值: ${config.bbandDownCrossMiddle.params.diff}
標準差: ${config.bbandDownCrossMiddle.params.std}
股價: ${price}
${config.bbandDownCrossMiddle.params.period}日Bollinger Band中軌: ${roundToN(condition11.lastMiddleBand, 2)}
是否看漲：${config.bbandDownCrossMiddle.up ? '是' : '否'}`;
    sendLineMsg(lineMessage);
    
    alertLogger.info(`${stock.stock} bbandDownCrossMiddle, price: ${price}, bband: ${roundToN(condition11.lastMiddleBand, 2)}, 是否看漲：${config.bbandDownCrossMiddle.up ? '是' : '否'}`);
  };
  if (condition12.result && !triggered[stock.stock]['bbandUpCrossMiddle']) { // bbandUpCrossMiddle
    triggered[stock.stock]['bbandUpCrossMiddle'] = true;
    produceFront({
      id: stock.id,
      stock: stock.stock,
      industry: stock.industry,
      price: price,
      type: 'bbandUpCrossMiddle',
      msg: `股價向上穿越${config.bbandUpCrossMiddle.params.period}日Bollinger Band中軌`,
      Middlebband: roundToN(condition12.lastMiddleBand, 2),
      diff: config.bbandUpCrossMiddle.params.diff,
      std: config.bbandUpCrossMiddle.params.std,
      up: config.bbandUpCrossMiddle.up,
      timestamp: stock.timestamp,
      init: false // 是否一開始就觸發
    })
    // line message
    const lineMessage = `\n股票代號: ${stock.stock}
產業別: ${stock.industry}
條件: 股價向上穿越${config.bbandUpCrossMiddle.params.period}日Bollinger Band中軌
設定差值: ${config.bbandUpCrossMiddle.params.diff}
標準差: ${config.bbandUpCrossMiddle.params.std}
股價: ${price}
${config.bbandUpCrossMiddle.params.period}日Bollinger Band中軌: ${roundToN(condition12.lastMiddleBand, 2)}
是否看漲：${config.bbandUpCrossMiddle.up ? '是' : '否'}`;
    sendLineMsg(lineMessage);


    alertLogger.info(`${stock.stock} bbandUpCrossMiddle, price: ${price}, bband: ${roundToN(condition12.lastMiddleBand, 2)}`, `是否看漲：${config.bbandUpCrossMiddle.up ? '是' : '否'}`);
  };
}

module.exports = {
  alertOnce,
  alert
}