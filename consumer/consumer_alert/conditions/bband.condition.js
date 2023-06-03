const { getLastBBand } = require('../talib/bband');

// 股價由下往上穿越下軌線，可能表示股價即將向上反轉
const bbandDownCross = async ({price, diff, period, NumOfDev}) => {
  const { lastLowerBand } = await getLastBBand({ price, period, NumOfDev });
  const lastClose = price.close[price.close.length - 1];
  return {
    result: lastClose + (diff || 0) >= lastLowerBand,
    lastClose,
    lastLowerBand,
  };
}

// 股價由下往上穿越上軌線，可能表示股價即將向下反轉
const bbandUpCross = async ({price, diff, period, NumOfDev}) => {
  const { lastUpperBand } = await getLastBBand({ price, period, NumOfDev });
  const lastClose = price.close[price.close.length - 1];
  return {
    result: lastClose + (diff || 0) >= lastUpperBand,
    lastClose,
    lastUpperBand
  };
}

// 股價由下往上穿越中軌線，可能表示股價即將向上反轉
const bbandDownCrossMiddle = async ({price, diff, period, NumOfDev}) => {
  const { lastMiddleBand } = await getLastBBand({ price, period, NumOfDev });
  const lastClose = price.close[price.close.length - 1];
  return {
    result: lastClose + (diff || 0) >= lastMiddleBand,
    lastClose,
    lastMiddleBand
  };
}

// 股價由上往下穿越中軌線，可能表示股價即將向下反轉
const bbandUpCrossMiddle = async ({price, diff, period, NumOfDev}) => {
  const { lastMiddleBand } = await getLastBBand({ price, period, NumOfDev });
  const lastClose = price.close[price.close.length - 1];
  return {
    result: lastClose - (diff || 0) <= lastMiddleBand,
    lastClose,
    lastMiddleBand
  };
}

module.exports = {
  bbandDownCross,
  bbandUpCross,
  bbandDownCrossMiddle,
  bbandUpCrossMiddle
}