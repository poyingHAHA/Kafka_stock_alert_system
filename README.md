# Kafka_stock_alert_system

## 使用方式
1. 使用前記得要開啟broker server跟zookeeper server
2. cd到producer資料夾下`npm install`下載相關套件
3. 使用`node insdex.js` 啟動producer
4. cd到consumer/consumer_alert下`npm install`下載相關套件
5. 使用`node insdex.js` 啟動consumer

## Producer產生的資料格式
```JS
{
  "stock": "2330台積電",
  "price": {
    "open": [
      ...
    ],
    "high": [
      ...
    ],
    "low": [
      ...
    ],
    "close": [
      ...
    ],
    "volume": [
      ...
    ]
  },
  "timestamp": "2023-06-03 16:34:45"
}
```
## 套件使用解釋
* talib: 技術指標計算
* cron: 排程用
* axios: 讀取API用
* dotenv: 設定環境變數用