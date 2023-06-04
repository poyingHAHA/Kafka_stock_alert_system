const dotenv = require('dotenv');
dotenv.config();
const { kafka } = require('./broker/brokerClient');
const fs = require("fs");
const { alertOnce, alert } = require('./conditions/index');

const consumer = kafka.consumer({ groupId: process.env.CONSUMER_GROUP });
const topic = process.env.STOCK_PRICE_TOPIC;

let once = require('./json/triggered.json');

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const history = await JSON.parse( message.value.toString() );
      // 排除掉一開始已經符合觸發條件的股票後就可以正常的執行alert
      if(once[history.stock]) alert(history);
      // 如果該股票已經觸發過，就不會再觸發alertOnce，這樣可以避免重複觸發
      if(!once[history.stock]) {
        alertOnce(history)
        once[history.stock] = true;
      };
    }
  });
})()

// console.log(history)
// fs.writeFile(`./json/${history.stock}.json`, JSON.stringify(history), (err) => {
//   if (err) throw err;
//   console.log('The file has been saved!');
// })