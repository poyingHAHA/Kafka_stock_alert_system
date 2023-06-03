const talib = require('talib');

const getLastKd = async ({price, fastK, slowK, slowD}) => {
  const result = await talib.execute({
    name: 'STOCH',
    startIdx: 0,
    endIdx: price.close.length - 1,
    high: price.high,
    low: price.low,
    close: price.close,
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

const getKd = async ({price, fastK, slowK, slowD}) => {
  const result = await talib.execute({
    name: 'STOCH',
    startIdx: 0,
    endIdx: price.close.length - 1,
    high: price.high,
    low: price.low,
    close: price.close,
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