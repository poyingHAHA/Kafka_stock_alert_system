const talib = require('talib');

/**
 * 
 * @param {*} closes : array of stock close price
 * @param {*} period : period of SMA
 * @returns : last SMA
 */
const getLastSMAClose = async (price, period) => {
  const result = await talib.execute({
    name: 'SMA',
    startIdx: 0,
    endIdx: price.close.length - 1,
    inReal: price.close,
    optInTimePeriod: period
  })
  return {lastSMA: result.result.outReal[result.result.outReal.length - 1]}
}

const getSMAClose = async (price, period) => {
  const result = await talib.execute({
    name: 'SMA',
    startIdx: 0,
    endIdx: price.close.length - 1,
    inReal: price.close,
    optInTimePeriod: period
  })
  return {SMA: result.result.outReal}
}


module.exports = {
  getLastSMAClose,
  getSMAClose
}