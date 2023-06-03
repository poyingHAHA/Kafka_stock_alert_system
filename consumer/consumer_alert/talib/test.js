const { getLastSMAClose, getSMAClose } = require('./sma');
const stock2330 = require('../json/2330台積電.json');
const stock2330Close = stock2330.price.close;

( async () => {
  // const result = await getLastSMAClose(stock2330Close, 5)
  // console.log(result)

  const result2 = await getSMAClose(stock2330Close, 5)
  console.log(result2)

})()