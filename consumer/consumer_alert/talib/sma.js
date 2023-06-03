const talib = require('talib');

/**
 * 
 * @param {*} closes : array of stock close price
 * @param {*} period : period of SMA
 * @returns : last SMA
 */
const getLastSMAClose = async (closes, period) => {
  const result = await talib.execute({
    name: 'SMA',
    startIdx: 0,
    endIdx: closes.length - 1,
    inReal: closes,
    optInTimePeriod: period
  })
  return {lastSMA: result.result.outReal[result.result.outReal.length - 1]}
}

const getSMAClose = async (closes, period) => {
  const result = await talib.execute({
    name: 'SMA',
    startIdx: 0,
    endIdx: closes.length - 1,
    inReal: closes,
    optInTimePeriod: period
  })
  return {SMA: result.result.outReal}
}


module.exports = {
  getLastSMAClose,
  getSMAClose
}