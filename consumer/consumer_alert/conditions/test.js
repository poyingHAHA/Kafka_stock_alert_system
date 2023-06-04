const { smaUpCross, smaDownCross, smaShortDownCrossLong, smaShortUpCrossLong } = require('./sma.condition');
const { kdUpCross, kdDiffUpCross, kdDiffDownCross, kdDownCross, kdUpThreshold, kdDownThreshold } = require('./kd.condition');
const { bbandDownCross, bbandUpCross, bbandDownCrossMiddle, bbandUpCrossMiddle } = require('./bband.condition');
const stock2330 = require('../json/2330台積電.json');

// sma condition test
// (async () => {
//     const result = await smaUpCross({price: stock2330.price, period: 10});
//     console.log(result);

//     const result2 = await smaDownCross({price: stock2330.price, period: 10});
//     console.log(result2);

//     const result3 = await smaShortDownCrossLong({price: stock2330.price, shortPeriod: 5, longPeriod: 10});
//     console.log(result3);

//     const result4 = await smaShortUpCrossLong({price: stock2330.price, shortPeriod: 5, longPeriod: 10});
//     console.log(result4);
//   }
// )()

// kd condition test
// (async () => {
//   const result = await kdUpCross({price: stock2330.price});
//   console.log("k值由下往上穿越d值測試: ", result);

//   const result2 = await kdDiffUpCross({price: stock2330.price, diff: 5});
//   console.log("k值還差diff值就要向上穿越d值測試: ", result2);

//   const result3 = await kdDiffDownCross({price: stock2330.price, diff: 5});
//   console.log("k值還差diff值就要向下穿越d值測試: ", result3);

//   const result4 = await kdDownCross({price: stock2330.price});
//   console.log("k值由上往下穿越d值測試: ", result4);

//   const result5 = await kdUpThreshold({price: stock2330.price, threshold: 80});
//   console.log("k值即將或已經超越threshold值測試:", result5);

//   const result6 = await kdDownThreshold({price: stock2330.price, threshold: 20});
//   console.log("k值即將或已經低於threshold值: ", result6);
// })()

// bbands condition test
(async () => {
  const result = await bbandDownCross({price: stock2330.price, period: 5, NumOfDev: 2});
  console.log("股價由上往下穿越下緣測試: ", result);

  const result2 = await bbandUpCross({price: stock2330.price, period: 5, NumOfDev: 2});
  console.log("股價由下往上穿越上緣測試: ", result2);

  const result3 = await bbandDownCrossMiddle({price: stock2330.price, period: 5, NumOfDev: 2});
  console.log("股價由上往下穿越中線測試: ", result3);

  const result4 = await bbandUpCrossMiddle({price: stock2330.price, period: 5, NumOfDev: 2});
  console.log("股價由下往上穿越中線測試: ", result4);
})()