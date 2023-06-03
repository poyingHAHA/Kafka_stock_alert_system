const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [process.env.BROKER1, process.env.BROKER2, process.env.BROKER3],
})

module.exports = { kafka }