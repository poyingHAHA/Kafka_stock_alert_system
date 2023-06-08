const { kafka } = require('../broker/brokerClient.js');
const {CompressionTypes} = require('kafkajs')
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

const topic = process.env.STOCK_FRONT_TOPIC;
const producer = kafka.producer();

// 載入所需的插件
dayjs.extend(utc);
dayjs.extend(timezone);
// 設定預設時區
dayjs.tz.setDefault('Asia/Taipei'); // 請根據您的當地時區設定

(async () =>{
  await producer.connect();
})()

const produceFront = async(data) => {
  // console.log(data)
  // 將資料送到kafka
  try{
    await producer.send({
      topic,
      compression: CompressionTypes.GZIP,
      // 以stock_id為key，以確保順序
      messages: [
        { key: data.id, value: JSON.stringify({...data}) },
      ],
    });
  } catch(err){
    console.log(err)
  }
}


module.exports = produceFront;