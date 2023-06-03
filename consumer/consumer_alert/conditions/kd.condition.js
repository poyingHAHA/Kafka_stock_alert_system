const { getLastKd } = require('./kd');

// k值由下往上穿越d值
const kdUpCross = async (highs, lows, closes, fastK, slowK, slowD) => {
  const { lastK, lastD } = await getLastKd({
    highs,
    lows,
    closes,
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
const kdDiffUpCross = async (highs, lows, closes, diff, fastK, slowK, slowD) => {
  const { lastK, lastD } = await getLastKd({
    highs,
    lows,
    closes,
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
const kdDiffDownCross = async (highs, lows, closes, diff, fastK, slowK, slowD) => {
  const { lastK, lastD } = await getLastKd({
    highs,
    lows,
    closes,
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
const kdDownCross = async (highs, lows, closes, fastK, slowK, slowD) => {
  const { lastK, lastD } = await getLastKd({
    highs,
    lows,
    closes,
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

// k值即將或已經低於threshold值

module.exports = {
  kdUpCross,
  kdDiffUpCross,
  kdDiffDownCross,
  kdDownCross
}