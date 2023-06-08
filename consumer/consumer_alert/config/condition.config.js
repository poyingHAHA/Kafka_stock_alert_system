module.exports = {
  kdUpCross: {
    name: 'K值由下往上穿越D值',
    params: {
      fastK: 9,
      slowK: 3,
      slowD: 3
    },
    up: true, // 是否看漲
    get description() {
      return `K值由下往上穿越D值, fastK: ${this.params.fastK}, slowK: ${this.params.slowK}, slowD: ${this.params.slowD}`;
    }
  },
  kdDownCross: {
    name: 'K值由上往下穿越D值',
    params: {
      fastK: 9,
      slowK: 3,
      slowD: 3
    },
    up: false, // 是否看漲
    get description() {
      return `K值由上往下穿越D值, fastK: ${this.params.fastK}, slowK: ${this.params.slowK}, slowD: ${this.params.slowD}`;
    }
  },
  kdUpThreshold: {
    name: `K值即將或已經超越threshold值`,
    params: {
      threshold: 80,
      diff: 0,
      fastK: 9,
      slowK: 3,
      slowD: 3
    },
    up: true, // 是否看漲
    get description() {
      return `K值即將或已經超越${this.params.threshold}, 設定差距: ${this.params.diff}, fastK: ${this.params.fastK}, slowK: ${this.params.slowK}, slowD: ${this.params.slowD}`;
    }
  },
  kdDownThreshold: {
    name: `K值即將或已經低於threshold值`,
    params: {
      threshold: 20,
      diff: 0,
      fastK: 9,
      slowK: 3,
      slowD: 3
    },
    up: false, // 是否看漲
    get description() {
      return `K值即將或已經低於${this.params.threshold}, 設定差距值: ${this.params.diff}, fastK: ${this.params.fastK}, slowK: ${this.params.slowK}, slowD: ${this.params.slowD}`;
    }
  },
  kdDiffUpCross: {
    name: `K值差[diff]由下往上穿越D值`,
    params: {
      diff: 5,
      fastK: 9,
      slowK: 3,
      slowD: 3
    },
    up: true, // 是否看漲
    get description() {
      return `K值差[diff]由下往上穿越D值, diff: ${this.params.diff}, fastK: ${this.params.fastK}, slowK: ${this.params.slowK}, slowD: ${this.params.slowD}`;
    }
  },
  kdDiffDownCross: {
    name: `K值差[diff]由上往下穿越D值`,
    params: {
      diff: 5,
      fastK: 9,
      slowK: 3,
      slowD: 3
    },
    up: false, // 是否看漲
    get description() {
      return `K值差[diff]由上往下穿越D值, diff: ${this.params.diff}, fastK: ${this.params.fastK}, slowK: ${this.params.slowK}, slowD: ${this.params.slowD}`;
    }
  },
  smaUpCross: {
    name: `股價由下往上穿越均線`,
    params: {
      period: 5,
      diff: 0
    },
    up: true, // 是否看漲
    get description() {
      return `股價由下往上穿越${this.params.period}日均線, 設定差距值: ${this.params.diff}`;
    }
  },
  smaDownCross: {
    name: `股價由上往下穿越均線`,
    params: {
      period: 5,
      diff: 0
    },
    up: false, // 是否看漲
    get description() {
      return `股價由上往下穿越${this.params.period}日均線, 設定差距值: ${this.params.diff}`;
    }
  },
  smaShortUpCrossLong: {
    name: `短期均線由下往上穿越長期均線`,
    params: {
      shortPeriod: 5,
      longPeriod: 10,
      diff: 0
    },
    up: true, // 是否看漲
    get description() {
      return `短期均線由下往上穿越長期均線, 短期均線天數: ${this.params.shortPeriod}, 長期均線天數: ${this.params.longPeriod}, 設定差距值: ${this.params.diff}`;
    }
  },
  smaShortDownCrossLong: {
    name: `短期均線由上往下穿越長期均線`,
    params: {
      shortPeriod: 5,
      longPeriod: 10,
      diff: 0
    },
    up: false, // 是否看漲
    get description() {
      return `短期均線由上往下穿越長期均線, 短期均線天數: ${this.params.shortPeriod}, 長期均線天數: ${this.params.longPeriod}, 設定差距值: ${this.params.diff}`;
    }
  },
  bbandDownCross: {
    name: `股價由上往下穿越布林下軌`,
    params: {
      period: 20,
      diff: 0,
      std: 2
    },
    up: false, // 是否看漲
    get description() {
      return `股價由上往下穿越${this.params.period}日布林下軌, 設定差距值: ${this.params.diff}, 標準差: ${this.params.std}`;
    }
  },
  bbandUpCross: {
    name: `股價由下往上穿越布林上軌`,
    params: {
      period: 20,
      diff: 0,
      std: 2
    },
    up: true, // 是否看漲
    get description() {
      return `股價由下往上穿越${this.params.period}日布林上軌, 設定差距值: ${this.params.diff}, 標準差: ${this.params.std}`;
    }
  },
  bbandDownCrossMiddle: {
    name: `股價由上往下穿越布林中軌`,
    params: {
      period: 20,
      diff: 0,
      std: 2
    },
    up: false, // 是否看漲
    get description() {
      return `股價由上往下穿越${this.params.period}日布林中軌, 設定差距值: ${this.params.diff}, 標準差: ${this.params.std}`;
    }
  },
  bbandUpCrossMiddle: {
    name: `股價由下往上穿越布林中軌`,
    params: {
      period: 20,
      diff: 0,
      std: 2
    },
    up: true, // 是否看漲
    get description() {
      return `股價由下往上穿越${this.params.period}日布林中軌, 設定差距值: ${this.params.diff}, 標準差: ${this.params.std}`;
    }
  },
}