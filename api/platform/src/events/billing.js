const { EVENTS, EventConsumer } = require('lib/events');
const { CreateBillingService }  = require('../services/billing');

const presentationCreatedConsumer = new EventConsumer(EVENTS.PRESENTATION_CREATED_EVENT);

const saveBillingSvc = new CreateBillingService();

const startEventConsumers = function () {
  Promise.all([
    presentationCreatedConsumer.consume(saveBillingSvc.save)
  ]);
}

module.exports = {
  startBillingEventConsumers: startEventConsumers
}