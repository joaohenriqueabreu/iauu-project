const { EVENTS, EventConsumer } = require('iauu/events');
const { CreateLeadService } = require('./services');

// const userRegisteredConsumer  = new EventConsumer(EVENTS.USER_REGISTERED_EVENT);
const userRegisteredConsumer  = new EventConsumer(EVENTS.USER_REGISTERED_EVENT);
const createLeadSvc           = new CreateLeadService();

const startEventConsumers     = function () {
  console.log('Listening to mail events...');
  Promise.all([
    userRegisteredConsumer.consume(function (user) { createLeadSvc.create(user); }),
  ]);
}

module.exports = {
  startEventConsumers: startEventConsumers
}