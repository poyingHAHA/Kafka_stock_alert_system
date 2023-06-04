# Kafka_stock_alert_system

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