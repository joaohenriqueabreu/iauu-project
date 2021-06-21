const { startPresentationEventConsumers } = require('./presentation');
const { startBillingEventConsumers }      = require('./billing');
const { startReferralEventConsumers }     = require('./referral');

module.exports = {
  startEventConsumers: function () {
    startPresentationEventConsumers();
    startBillingEventConsumers();
    startReferralEventConsumers();
  }
}