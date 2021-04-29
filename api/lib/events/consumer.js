const { EventBrokerException }        = require('../exception');
const { connectBroker, consumeEvent } = require('./broker');

module.exports = class EventConsumer {
  constructor(queue) {
    if (queue == null || typeof queue != 'string') { 
      throw new EventBrokerException('Must provide a valid message queue name'); 
    }

    this.queue  = queue;    
  }

  async connect() {
    this.broker = await connectBroker(this.queue);
  }

  async consume(callback) {
    try {
      await this.connect();
      await consumeEvent(this.broker, this.queue, message => {
        // parse message        
        callback(JSON.parse(message.content));
      });
    } catch (error) {
      console.log(error);
      throw new EventBrokerException(error);
    }
  }
}
