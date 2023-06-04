# Kafka_stock_alert_system

## 使用方式
1. 使用前記得要開啟broker server跟zookeeper server，記得修broker server的設定檔，因為broker client目前設定是三個，所以有三個broker的設定檔要修改。以下是我的修改:<br><br>

config/server1.properties
```
broker.id=101
listeners=PLAINTEXT://localhost:9093
num.partitions=6
```
config/server2.properties
```
broker.id=102
listeners=PLAINTEXT://localhost:9094
num.partitions=6
```
config/server3.properties
```
broker.id=103
listeners=PLAINTEXT://localhost:9095
num.partitions=6
```

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