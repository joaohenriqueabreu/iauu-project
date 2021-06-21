const { EVENTS, EventConsumer }                 = require('iauu/events');
const { RegisterPresentationReferralService }   = require('../services/referral');

const presentationCompletedConsumer = new EventConsumer(EVENTS.PRESENTATION_COMPLETED_EVENT);

const registerPresentationReferral = new RegisterPresentationReferralService();

const startEventConsumers = function () {
  Promise.all([
    presentationCompletedConsumer.consume(function (presentation) { registerPresentationReferral.register(presentation); })
  ]);
}

module.exports = {
  startReferralEventConsumers: startEventConsumers
}