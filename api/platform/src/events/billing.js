const { EVENTS, EventConsumer } = require('iauu/events');
const { CreateBillingService }  = require('../services/billing');

const presentationCreatedConsumer = new EventConsumer(EVENTS.PRESENTATION_CREATED_EVENT);

const createBillingSvc = new CreateBillingService();

const startEventConsumers = function () {
  Promise.all([
    presentationCreatedConsumer.consume(function (presentation) { createBillingSvc.save(presentation); })
  ]);
}

module.exports = {
  startBillingEventConsumers: startEventConsumers
}