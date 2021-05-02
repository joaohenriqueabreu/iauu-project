const EventPublisher = require('./publisher');

module.exports = class EventConsumerService {
  async emitEvent(event, data) {
    const eventPublisher = new EventPublisher(event);
    
    try {
      await eventPublisher.publish(data);
    } catch (error) {
      // do something
      console.log(error);
    }
  }

  cleanup(data) {
    delete(data.create_dt);
    delete(data.update_dt);    
    return data;
  }
}