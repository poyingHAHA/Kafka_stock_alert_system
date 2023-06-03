const { smaUpCross, smaDownCross, smaShortDownCrossLong, smaShortUpCrossLong } = require('./sma.condition');
const stock2330 = require('../json/2330台積電.json');

(
  async () => {
    const result = await smaUpCross(stock2330.price.close, 10);
    console.log(result);

    const result2 = await smaDownCross(stock2330.price.close, 10);
    console.log(result2);

    const result3 = await smaShortDownCrossLong(stock2330.price.close, 5, 10);
    console.log(result3);

    const result4 = await smaShortUpCrossLong(stock2330.price.close, 5, 10);
    console.log(result4);
  }
)()