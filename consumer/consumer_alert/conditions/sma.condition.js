const { getLastSMAClose } = require('../talib/sma');

// 股價向上超越SMA_period
const smaUpCross = async (price, period) => {
  const { lastSMA } = await getLastSMAClose(price, period);
  const lastClose = price.close[price.close.length - 1];
  return {
    result: lastClose > lastSMA,
    lastClose,
    lastSMA,
  };
}

// 股價向下跌破SMA_period
const smaDownCross = async (price, period) => {
  const { lastSMA } = await getLastSMAClose(price, period);
  const lastClose = price.close[price.close.length - 1];
  return {
    result: lastClose < lastSMA,
    lastClose,
    lastSMA
  };
}

// short日sma向上超越long日sma
const smaShortUpCrossLong = async (price, shortPeriod, longPeriod) => {
  const { lastSMA: shortSMA } = await getLastSMAClose(price, shortPeriod);
  const { lastSMA: longSMA } = await getLastSMAClose(price, longPeriod);
  return {
    result: shortSMA > longSMA,
    shortSMA,
    longSMA
  };
}

// short日sma向下跌破long日sma
const smaShortDownCrossLong = async (price, shortPeriod, longPeriod) => {
  const { lastSMA: shortSMA } = await getLastSMAClose(price, shortPeriod);
  const { lastSMA: longSMA } = await getLastSMAClose(price, longPeriod);
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