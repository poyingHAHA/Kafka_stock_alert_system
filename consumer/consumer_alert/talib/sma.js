const talib = require('talib');

/**
 * 
 * @param {*} stockCloseArr : array of stock close price
 * @param {*} period : period of SMA
 * @returns : last SMA
 */
const getLastSMAClose = async (stockCloseArr, period) => {
  const result = await talib.execute({
    name: 'SMA',
    startIdx: 0,
    endIdx: stockCloseArr.length - 1,
    inReal: stockCloseArr,
    optInTimePeriod: period
  })
  return result.result.outReal[result.result.outReal.length - 1]
}

const getSMAClose = async (stockCloseArr, period) => {
  const result = await talib.execute({
    name: 'SMA',
    startIdx: 0,
    endIdx: stockCloseArr.length - 1,
    inReal: stockCloseArr,
    optInTimePeriod: period
  })
  return result.result.outReal
}


module.exports = {
  getLastSMAClose,
  getSMAClose
}