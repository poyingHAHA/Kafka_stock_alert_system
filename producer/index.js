const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const CronJob = require('cron').CronJob;
const { kafka } = require('./broker/brokerClient.js');
const {CompressionTypes} = require('kafkajs')
const producer = kafka.producer();
const toTalibFormat = require('./utils/toTalibFormat.js');
const topic = process.env.TOPIC;
// 半導體174支股票id
const stockIDs = require('./stockID.json');


(async() => {
  // 連接broker
  await producer.connect();

  // 每10秒爬取一次台積電的股價
  let job = new CronJob('*/5 * * * * *', function() {
    let stock_id = '2330';
    axios({
      method: 'get',
      url: `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stock_id}&v=1&callback=jQuery111309023063595469201_1661825388208&_=1661825388209`,
    }).then(async (res) => {
      const data = JSON.parse(res.data.replace(/^[^\(]*\(/, '').replace(/\)[^\)]*$/, '').replace(/\"143":\d+,/, '')) // 將143的資料刪除，因為value的開頭是0會報錯
      const latestPrice = {
        // [`${data.id+data.mem.name}`]: data.ta[data.ta.length - 1]
        // [`${data.id+data.mem.name}`]: data.ta
        stock: `${data.id+data.mem.name}`,
        price: toTalibFormat(data.ta),
      }
      console.log(`${data.id} sent`)
      await producer.send({
        topic,
        compression: CompressionTypes.GZIP,
        // 以stock_id為key，以確保順序
        messages: [
          { kery: data.id, value: JSON.stringify(latestPrice) },
        ],
      });
    })
  }, null, true, 'Asia/Taipei');

  // 開始爬取
  job.start();
})()





// 爬取台股半導體174支股票，目前先用2330測試
// for(stock_id of stockIDs.semi) {
//   let id = stock_id
//   axios({
//       method: 'get',
//       url: `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stock_id}&v=1&callback=jQuery111309023063595469201_1661825388208&_=1661825388209`,
//   }).then((res) => {
//     const data = JSON.parse(res.data.replace(/^[^\(]*\(/, '').replace(/\)[^\)]*$/, '').replace(/\"143":\d+,/, ''))
//     console.log(`${data.id}${data.mem.name}: `, data.ta[data.ta.length - 1])
//   }).catch((err) => {
//     // 2334已經下市
//     console.log(id, "已下市")
//   })
// }
