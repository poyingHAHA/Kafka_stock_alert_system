const { getLastKd } = require('../talib/kd');

// k值由下往上穿越d值
const kdUpCross = async (price, fastK, slowK, slowD) => {
  const { lastK, lastD } = await getLastKd({
    price,
    fastK: fastK || 9,
    slowK: slowK || 3,
    slowD: slowD || 3
  });
  return {
    result: lastK > lastD,
    lastK,
    lastD
  };
}

// k值還差diff值就要向上穿越d值
const kdDiffUpCross = async (price, diff, fastK, slowK, slowD) => {
  const { lastK, lastD } = await getLastKd({
    price,
    fastK: fastK || 9,
    slowK: slowK || 3,
    slowD: slowD || 3
  });
  return {
    result: lastK + diff >= lastD,
    lastK,
    lastD,
    diff: lastD - lastK // k值還差多少就要向上穿越d值
  } ;
}

// k值還差diff值就要向下穿越d值
const kdDiffDownCross = async (price, diff, fastK, slowK, slowD) => {
  const { lastK, lastD } = await getLastKd({
    price,
    fastK: fastK || 9,
    slowK: slowK || 3,
    slowD: slowD || 3
  });
  return {
    result: lastK - diff <= lastD,
    lastK,
    lastD,
    diff: lastK - lastD // k值還差多少就要向下穿越d值
  } ;
}

// k值由上往下穿越d值
const kdDownCross = async (price, fastK, slowK, slowD) => {
  const { lastK, lastD } = await getLastKd({
    price,
    fastK: fastK || 9,
    slowK: slowK || 3,
    slowD: slowD || 3
  });
  return {
    result: lastK < lastD,
    lastK,
    lastD
  };
}

// k值即將或已經超越threshold值
const kdUpThreshold = async (price, threshold, diff, fastK, slowK, slowD) => {
  const { lastK, lastD } = await getLastKd({
    price,
    fastK: fastK || 9,
    slowK: slowK || 3,
    slowD: slowD || 3
  });
  return {
    result: (lastK + (diff || 0)) >= threshold,
    lastK,
    lastD,
    diff: lastK - threshold // k值還差多少就要超越threshold值
  } ;
}

// k值即將或已經低於threshold值
const kdDownThreshold = async (price, threshold, diff, fastK, slowK, slowD) => {
  const { lastK, lastD } = await getLastKd({
    price,
    fastK: fastK || 9,
    slowK: slowK || 3,
    slowD: slowD || 3
  });
  return {
    result: (lastK - (diff || 0)) <= threshold,
    lastK,
    lastD,
    diff: threshold - lastK // k值還差多少就要低於threshold值
  } ;
}

module.exports = {
  kdUpCross,
  kdDiffUpCross,
  kdDiffDownCross,
  kdDownCross,
  kdUpThreshold,
  kdDownThreshold
}