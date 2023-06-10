const dotenv = require('dotenv');
dotenv.config();
const { kafka } = require('./src/broker/brokerClient');
const path = require('path');
const fs = require("fs");
const express = require('express');
const cors = require('cors');
const { db, stockAlert, stockBasic } = require('./src/model/index.js');

const consumer = kafka.consumer({ groupId: process.env.CONSUMER_GROUP });
const topic = process.env.STOCK_FRONT_TOPIC;

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const history = await JSON.parse( message.value.toString() );
      
      // 儲存資料到MongoDB
      const newStockAlert = new stockAlert({...history, stock_id: history.id, initial: history.init});
      await newStockAlert.save();
      const exist = await stockBasic.findOne({id: history.id});
      if (!exist) {
        const newStockBasic = new stockBasic(history);
        await newStockBasic.save();
      }


      // 下方為將資料存json檔案的方法
      // const filePath = path.join(__dirname, `/jsons/${history.stock}.json`);
      // // 讀取現有的json檔案
      // let existingData = []
      // try {
      //   const file = fs.readFileSync(filePath, 'utf8');
      //   existingData = JSON.parse(file);
      // } catch (err) {
      //   // 若檔案不存在，則新建一個空的陣列
      //   if (err.code === 'ENOENT') {
      //     console.log('File does not exist. Creating a new file.');
      //     existingData = [];
      //     // 確保路徑上的目錄存在，如果不存在則建立目錄
      //     fs.mkdirSync(path.dirname(filePath), { recursive: true });
      //   } else {
      //     console.log('Error reading existing JSON file:', err);
      //   }
      // }

      // // 合併新舊資料
      // const mergedData = [...existingData, history];

      // // 將合併後的資料寫入 JSON 檔案
      // try {
      //   const jsonData = JSON.stringify(mergedData, null, 2);
      //   fs.writeFileSync(filePath, jsonData);
      //   console.log(`Stock data saved to./jsons/${history.stock}.json`);
      // } catch (error) {
      //   console.log('Error writing JSON file:', error);
      // }
    }
  });
}
)();


// db connect success
db.once('open', () => {
  console.log('MongoDB connected!');

  // Restful API
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // get All stocks
  app.get('/api/stocks', async (req, res) => {
    try {
      const stocks = await stockBasic.find();
      res.status(200).send({ data: stocks });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });


  // get stockAlert by stock
  app.get('/api/stockAlert/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const data = await stockAlert.find({ stock_id: id });
      res.status(200).send({ data });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err.message });
    }
  });
  
  // listen
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  })
});
