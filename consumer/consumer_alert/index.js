const dotenv = require('dotenv');
dotenv.config();
const { kafka } = require('./broker/brokerClient');
const fs = require("fs");

const consumer = kafka.consumer({ groupId: process.env.CONSUMER_GROUP });
const topic = process.env.STOCK_PRICE_TOPIC;

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const history = JSON.parse( message.value.toString() )
      console.log(history)
    }
  });
})()

// console.log(history)
// fs.writeFile(`./json/${history.stock}.json`, JSON.stringify(history), (err) => {
//   if (err) throw err;
//   console.log('The file has been saved!');
// })