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

