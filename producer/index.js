const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const CronJob = require('cron').CronJob;
const { kafka } = require('./broker/brokerClient.js');
const {CompressionTypes} = require('kafkajs')
const fs = require("fs");
const path = require('path');
const toTalibFormat = require('./utils/toTalibFormat.js');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

const topic = process.env.STOCK_PRICE_TOPIC;
const producer = kafka.producer();

// 載入所需的插件
dayjs.extend(utc);
dayjs.extend(timezone);
// 設定預設時區
dayjs.tz.setDefault('Asia/Taipei'); // 請根據您的當地時區設定

// 半導體174支股票id
const stockIDs = require('./stockID.json');
const backUpPath = path.join(__dirname, 'json', 'backUp.json');

(async() => {
  // 連接broker
  await producer.connect();

  // 每10秒爬取一次台積電的股價
  let job = new CronJob('*/10 * * * * *', async function() {
    // let stock_id = '2330';
    await waitRandomDelay(3000, 10000); // 隨機延遲3~10秒
    
    for(stock_id of stockIDs.semi) {
      // 設定合適的 User-Agent
      const headers = {
        'User-Agent': user_agents[Math.floor(Math.random() * user_agents.length)],
      };

      // 爬取股價
      axios({
        method: 'get',
        url: `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stock_id}&v=1&callback=jQuery111309023063595469201_1661825388208&_=1661825388209`,
        headers,
      }).then(async (res) => {
        const data = JSON.parse(res.data.replace(/^[^\(]*\(/, '').replace(/\)[^\)]*$/, '').replace(/\"143":\d+,/, '')) // 將143的資料刪除，因為value的開頭是0會報錯
        const latestPrice = {
          id: data.id, // '2330'
          stock: `${data.id+data.mem.name}`, // '2330台積電'
          price: toTalibFormat(data.ta),
          timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          industry: "半導體" // 先寫死
        }
        console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')}: ${data.id} sent`)
        
        // 備份資料
        try {
          if (fs.existsSync(backUpPath)) {
            // 檔案存在，讀取現有資料並新增新資料
            const fileData = fs.readFileSync(backUpPath, 'utf8');
            let existingData = JSON.parse(fileData);
            existingData.push(latestPrice);
            fs.writeFileSync(backUpPath, JSON.stringify(existingData, null, 2), 'utf8');
            // console.log('Data appended to file successfully.');
          } else {
            // 檔案不存在，創建新檔案並寫入資料
            const newData = [latestPrice];
            fs.writeFileSync(backUpPath, JSON.stringify(newData, null, 2), 'utf8');
            console.log('File created and data written successfully.');
          }
        } catch (err) {
          console.error('Error writing file:', err);
        }
        

        // 將資料送到kafka
        await producer.send({
          topic,
          compression: CompressionTypes.GZIP,
          // 以stock_id為key，以確保順序
          messages: [
            { key: data.id, value: JSON.stringify(latestPrice) },
          ],
        });
      })
    }
  }, null, true, 'Asia/Taipei');

  // 開始爬取
  job.start();
})()

// 產生指定範圍內的隨機延遲
function waitRandomDelay(minDelay, maxDelay) {
  const delay = Math.random() * (maxDelay - minDelay) + minDelay;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// user_agents
const user_agents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.9999.99 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1664.3 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1664.3 Safari/537.36',
  'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.16 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1623.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.17 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.62 Safari/537.36',
  'Mozilla/5.0 (X11; CrOS i686 4319.74.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.57 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.2 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1468.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1467.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1464.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1500.55 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36',
  'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.90 Safari/537.36',
  'Mozilla/5.0 (X11; NetBSD) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36',
  'Mozilla/5.0 (X11; CrOS i686 3912.101.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.60 Safari/537.17',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1309.0 Safari/537.17',
  'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.15 (KHTML, like Gecko) Chrome/24.0.1295.0 Safari/537.15',
  'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.14 (KHTML, like Gecko) Chrome/24.0.1292.0 Safari/537.14'
]


// let triggered = {}
// // 爬取台股半導體174支股票，目前先用2330測試
// for(stock_id of stockIDs.semi) {
//   let id = stock_id
//   axios({
//       method: 'get',
//       url: `https://tw.quote.finance.yahoo.net/quote/q?type=ta&perd=d&mkt=10&sym=${stock_id}&v=1&callback=jQuery111309023063595469201_1661825388208&_=1661825388209`,
//   }).then((res) => {
//     const data = JSON.parse(res.data.replace(/^[^\(]*\(/, '').replace(/\)[^\)]*$/, '').replace(/\"143":\d+,/, ''))
//     console.log(`${data.id}${data.mem.name}: `, data.ta[data.ta.length - 1])
//     triggered[`${data.id}${data.mem.name}`] = {}
//     console.log(triggered)
//   }).catch((err) => {
//     // 2334已經下市
//     console.log(id, "已下市")
//   })
// }
