const EventPublisher  = require('./publisher');
const moment          = require('moment') ;

module.exports = class EventConsumerService {
  async emitEvent(event, data) {
    const timestamp = moment().format('DD-MM-YYYY hh:mm:ss');
    console.log('---------------------------------------------');
    console.log(`[${timestamp}]: Emitting event ${event}`);

    const eventPublisher = new EventPublisher(event);
    
    try {
      await eventPublisher.publish(data);
    } catch (error) {
      // do something
      console.log(`Event failied, error: ${error}`);
    }
  }

  cleanup(data) {
    delete(data.create_dt);
    delete(data.update_dt);    
    return data;
  }
}