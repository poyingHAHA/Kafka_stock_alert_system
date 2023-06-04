const { bbandDownCross, bbandUpCross, bbandDownCrossMiddle, bbandUpCrossMiddle } = require('./bband.condition');
const { kdUpCross, kdDiffUpCross, kdDiffDownCross, kdDownCross } = require('./kd.condition');
const { smaUpCross, smaDownCross, smaShortUpCrossLong, smaShortDownCrossLong } = require('./sma.condition');

// 每個條件一天只能觸發一次
let triggered = require('../json/triggered.json');

// 每天只會執行一次，而且是第一個執行
const alertOnce = async (stock) => {
  const condition1 = await kdUpCross({price: stock.price, fastK: 9, slowK: 3, slowD: 3});
  const condition2 = await kdDiffUpCross({price: stock.price, diff: 3, fastK: 9, slowK: 3, slowD: 3});
  const condition3 = await kdDiffDownCross({ price: stock.price, diff: 3, fastK: 9, slowK: 3, slowD: 3 });
  const condition4 = await kdDownCross({ price: stock.price, fastK: 9, slowK: 3, slowD: 3 });
  const condition5 = await smaUpCross({ price: stock.price, period: 5 });
  const condition6 = await smaDownCross({ price: stock.price, period: 5 });
  const condition7 = await smaShortUpCrossLong({ price: stock.price, shortPeriod: 5, longPeriod: 10 });
  const condition8 = await smaShortDownCrossLong({ price: stock.price, shortPeriod: 5, longPeriod: 10 });
  const condition9 = await bbandDownCross({ price: stock.price, period: 5, NumOfDev: 2 });
  const condition10 = await bbandUpCross({ price: stock.price, period: 5, NumOfDev: 2 });
  const condition11 = await bbandDownCrossMiddle({ price: stock.price, period: 5, NumOfDev: 2 });
  const condition12 = await bbandUpCrossMiddle({ price: stock.price, period: 5, NumOfDev: 2 });

  if (condition1.result) triggered[stock.stock]['kdUpCross'] = true;
  if (condition2.result) triggered[stock.stock]['kdDiffUpCross'] = true;
  if (condition3.result) triggered[stock.stock]['kdDiffDownCross'] = true;
  if (condition4.result) triggered[stock.stock]['kdDownCross'] = true;
  if (condition5.result) triggered[stock.stock]['smaUpCross'] = true;
  if (condition6.result) triggered[stock.stock]['smaDownCross'] = true;
  if (condition7.result) triggered[stock.stock]['smaShortUpCrossLong'] = true;
  if (condition8.result) triggered[stock.stock]['smaShortDownCrossLong'] = true;
  if (condition9.result) triggered[stock.stock]['bbandDownCross'] = true;
  if (condition10.result) triggered[stock.stock]['bbandUpCross'] = true;
  if (condition11.result) triggered[stock.stock]['bbandDownCrossMiddle'] = true;
  if (condition12.result) triggered[stock.stock]['bbandUpCrossMiddle'] = true;

  // console.log('triggered: ', triggered);
}

const alert = async (stock) => {
  const condition1 = await kdUpCross({price: stock.price, fastK: 9, slowK: 3, slowD: 3});
  const condition2 = await kdDiffUpCross({price: stock.price, diff: 3, fastK: 9, slowK: 3, slowD: 3});
  const condition3 = await kdDiffDownCross({ price: stock.price, diff: 3, fastK: 9, slowK: 3, slowD: 3 });
  const condition4 = await kdDownCross({ price: stock.price, fastK: 9, slowK: 3, slowD: 3 });
  const condition5 = await smaUpCross({ price: stock.price, period: 5 });
  const condition6 = await smaDownCross({ price: stock.price, period: 5 });
  const condition7 = await smaShortUpCrossLong({ price: stock.price, shortPeriod: 5, longPeriod: 10 });
  const condition8 = await smaShortDownCrossLong({ price: stock.price, shortPeriod: 5, longPeriod: 10 });
  const condition9 = await bbandDownCross({ price: stock.price, period: 5, NumOfDev: 2 });
  const condition10 = await bbandUpCross({ price: stock.price, period: 5, NumOfDev: 2 });
  const condition11 = await bbandDownCrossMiddle({ price: stock.price, period: 5, NumOfDev: 2 });
  const condition12 = await bbandUpCrossMiddle({ price: stock.price, period: 5, NumOfDev: 2 });

  if (condition1.result) triggered[stock.stock]['kdUpCross'] = true;
  if (condition2.result) triggered[stock.stock]['kdDiffUpCross'] = true;
  if (condition3.result) triggered[stock.stock]['kdDiffDownCross'] = true;
  if (condition4.result) triggered[stock.stock]['kdDownCross'] = true;
  if (condition5.result) triggered[stock.stock]['smaUpCross'] = true;
  if (condition6.result) triggered[stock.stock]['smaDownCross'] = true;
  if (condition7.result) triggered[stock.stock]['smaShortUpCrossLong'] = true;
  if (condition8.result) triggered[stock.stock]['smaShortDownCrossLong'] = true;
  if (condition9.result) triggered[stock.stock]['bbandDownCross'] = true;
  if (condition10.result) triggered[stock.stock]['bbandUpCross'] = true;
  if (condition11.result) triggered[stock.stock]['bbandDownCrossMiddle'] = true;
  if (condition12.result) triggered[stock.stock]['bbandUpCrossMiddle'] = true;

  // console.log('triggered: ', triggered);
}

module.exports = {
  alertOnce,
  alert
}