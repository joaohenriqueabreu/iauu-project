const { EventBrokerException }        = require('@iauu/exceptions');
const { connectBroker, publishEvent } = require('./broker');

module.exports = class EventPublisher {
  constructor(queue) {
    if (queue == null || typeof queue != 'string') { 
      throw new EventBrokerException('Must provide a valid message queue name'); 
    }

    this.queue  = queue;    
  }

  async connect() {
    this.broker = await connectBroker(this.queue);
  }

  async publish(data) {
    try {
      await this.connect();
      await publishEvent(this.broker, this.queue, Buffer.from(JSON.stringify(data)));
    } catch (error) {
      console.log(error);
      throw new EventBrokerException(error);
    }
  }
}
