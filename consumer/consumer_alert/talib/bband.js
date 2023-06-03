const talib = require('talib');

/**
 * @param {*} closes : array of stock close price
 * @param {*} period : period of BBANDS
 * @param {*} NumOdDev : Num of Deviation
 * @returns : {lastUpperBand, lastmiddleBand, lastLowerBand}
 */
const getLastBBand = async ({closes, period, NumOfDev}) => {
  const result = await talib.execute({
    name: 'BBANDS',
    startIdx: 0,
    endIdx: closes.length - 1,
    inReal: closes,
    optInTimePeriod: period,
    optInNbDevUp: NumOfDev,
    optInNbDevDn: NumOfDev,
    optInMAType: 0
  })

  return {
    lastUpperBand: result.result.outRealUpperBand[result.nbElement - 1],
    lastMiddleBand: result.result.outRealMiddleBand[result.nbElement - 1],
    lastLowerBand: result.result.outRealLowerBand[result.nbElement - 1]
  };
};

const getBBand = async ({closes, period, NumOfDev}) => {
  const result = await talib.execute({
    name: 'BBANDS',
    startIdx: 0,
    endIdx: closes.length - 1,
    inReal: closes,
    optInTimePeriod: period,
    optInNbDevUp: NumOfDev,
    optInNbDevDn: NumOfDev,
    optInMAType: 0
  })

  return {
    upperBand: result.result.outRealUpperBand,
    middleBand: result.result.outRealMiddleBand,
    lowerBand: result.result.outRealLowerBand
  };
}

module.exports = {
  getLastBBand,
  getBBand
}