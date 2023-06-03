
const toTalibFormat = (data) => {
  let result = { open: [], high: [], low: [], close: [], volume: [] };
  for (let i = 0; i < data.length; i++) {
    result.open.push(data[i].o);
    result.high.push(data[i].h);
    result.low.push(data[i].l);
    result.close.push(data[i].c);
    result.volume.push(data[i].v);
  }
  return result;
};

module.exports = toTalibFormat;