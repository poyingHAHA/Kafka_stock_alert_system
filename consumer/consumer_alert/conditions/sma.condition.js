const { getLastSMAClose } = require('../talib/sma');

// 股價向上超越SMA_period
const smaUpCross = async (closes, period) => {
  const { lastSMA } = await getLastSMAClose(closes, period);
  const lastClose = closes[closes.length - 1];
  return {
    result: lastClose > lastSMA,
    lastClose,
    lastSMA,
  };
}

// 股價向下跌破SMA_period
const smaDownCross = async (closes, period) => {
  const { lastSMA } = await getLastSMAClose(closes, period);
  const lastClose = closes[closes.length - 1];
  return {
    result: lastClose < lastSMA,
    lastClose,
    lastSMA
  };
}

// short日sma向上超越long日sma
const smaShortUpCrossLong = async (closes, shortPeriod, longPeriod) => {
  const { lastSMA: shortSMA } = await getLastSMAClose(closes, shortPeriod);
  const { lastSMA: longSMA } = await getLastSMAClose(closes, longPeriod);
  return {
    result: shortSMA > longSMA,
    shortSMA,
    longSMA
  };
}

// short日sma向下跌破long日sma
const smaShortDownCrossLong = async (closes, shortPeriod, longPeriod) => {
  const { lastSMA: shortSMA } = await getLastSMAClose(closes, shortPeriod);
  const { lastSMA: longSMA } = await getLastSMAClose(closes, longPeriod);
  return {
    result: shortSMA < longSMA,
    shortSMA,
    longSMA
  };
}


module.exports = {
  smaUpCross,
  smaDownCross,
  smaShortUpCrossLong,
  smaShortDownCrossLong
}