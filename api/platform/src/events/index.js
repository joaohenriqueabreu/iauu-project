const { startPresentationEventConsumers } = require('./presentation');
const { startBillingEventConsumers } = require('./billing');

module.exports = {
  startEventConsumers: function () {
    startPresentationEventConsumers();
    startBillingEventConsumers();
  }
}