const talib = require('talib');

const getLastKd = async ({highs, closes, lows, fastK, slowK, slowD}) => {
  const result = await talib.execute({
    name: 'STOCH',
    startIdx: 0,
    endIdx: closes.length - 1,
    high: highs,
    low: lows,
    close: closes,
    optInFastK_Period: fastK || 9,
    optInSlowK_Period: slowK || 3,
    optInSlowD_Period: slowD || 3,
    optInSlowK_MAType: 0,
    optInSlowD_MAType: 0
  });

  return {
    lastK: result.result.outSlowK[result.nbElement - 1],
    lastD: result.result.outSlowD[result.nbElement - 1]
  }
}

const getKd = async ({highs, closes, lows, fastK, slowK, slowD}) => {
  const result = await talib.execute({
    name: 'STOCH',
    startIdx: 0,
    endIdx: closes.length - 1,
    high: highs,
    low: lows,
    close: closes,
    optInFastK_Period: fastK || 9,
    optInSlowK_Period: slowK || 3,
    optInSlowD_Period: slowD || 3,
    optInSlowK_MAType: 0,
    optInSlowD_MAType: 0
  });

  return {
    K: result.result.outSlowK,
    D: result.result.outSlowD
  }
}

module.exports = {
  getLastKd,
  getKd
}