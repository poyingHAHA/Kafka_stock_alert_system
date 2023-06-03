const { getLastSMAClose, getSMAClose } = require('./sma');
const { getLastKd, getKd } = require('./kd');
const { getLastBBand, getBBand } = require('./bband');

const stock2330 = require('../json/2330台積電.json');
const stock2330Price = stock2330.price;

( async () => {
  // const result = await getLastSMAClose(stock2330Price, 5)
  // console.log(result)

  // const result2 = await getSMAClose(stock2330Price, 5)
  // console.log(result2)

  const result3 = await getLastKd({
    price: stock2330Price,
    fastK: 9,
    slowK: 3,
    slowD: 3
  })
  console.log(result3)

  const result4 = await getKd({
    price: stock2330Price,
    fastK: 9,
    slowK: 3,
    slowD: 3
  })
  console.log(result4)

  // const result5 = await getLastBBand({
  //   closes: stock2330Close,
  //   period: 5,
  //   NumOfDev: 2
  // })
  // console.log(result5)

  // const result6 = await getBBand({
  //   closes: stock2330Close,
  //   period: 5,
  //   NumOfDev: 2
  // })
  // console.log(result6)
  
})()