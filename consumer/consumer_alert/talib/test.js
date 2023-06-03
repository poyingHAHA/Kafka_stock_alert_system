// load the module and display its version
const stock2330 = require('../json/2330台積電.json');
const talib = require('talib');
// console.log("TALib Version: " + talib.version);

// Display all available indicator function names
const displayfns = () => {
  const functions = talib.functions;
  let fns = []
  for (i in functions) {
    fns.push(functions[i].name);
  }
  return fns;
}

// function exists
const fnExists = (fn) => {
  const functions = talib.functions;
  for (i in functions) {
    if (functions[i].name.toLowerCase() === fn.toLowerCase()) {
      return true;
    }
  }
  return false;
}

// function explain
const fnExplain = (fn) => {
  return talib.explain(fn.toUpperCase());
}

// console.log(fnExplain('sma'));
const period = 3; // 移动平均线的周期
talib.execute({
  name: 'SMA',
  startIdx: 0,
  endIdx: stock2330.price.close.length - 1,
  inReal: stock2330.price.close,
  optInTimePeriod: period
}, (err, result) => {
  if (err) {
    console.log(err);
    return;
  }
  // console.log(result);
  console.log(result.result.outReal[result.nbElement - 1]);
});