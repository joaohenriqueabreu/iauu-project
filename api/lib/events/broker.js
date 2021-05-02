const amqp                      = require('amqplib');
const config                    = require('../env');
const { EventBrokerException }  = require('../exception');

async function connect(){
  const conn = await amqp.connect(`amqp://${config.broker.host}:${config.broker.port}`);
  return conn.createChannel();
}

async function createQueue(channel, queue){
  try {
    await channel.assertQueue(queue, { durable: true });
    return channel;
  } catch (err) {
    throw new EventBrokerException(err);
  }  
}

async function connectBroker(queue) {
  let channel = await connect();
  channel     = await createQueue(channel, queue);
  return channel;
}

async function publishEvent(channel, queue, message) {
  await channel.sendToQueue(queue, message);
}

async function consumeEvent(channel, queue, callback) {
  try {
    await channel.consume(queue, callback, { noAck: true });  
  } catch (error) {
    throw error;
  }
}

module.exports = { connectBroker, publishEvent, consumeEvent }