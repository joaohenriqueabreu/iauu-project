const { EVENTS, EventConsumer }     = require('iauu/events');
const { CreatePresentationService } = require('../services/presentation');

const proposalAcceptedConsumer  = new EventConsumer(EVENTS.PROPOSAL_ACCEPTED_EVENT);
const createPresentationSvc     = new CreatePresentationService();

const startEventConsumers = function () {
  Promise.all([
    proposalAcceptedConsumer.consume(function (proposal) { createPresentationSvc.create(proposal) })
  ]);
}

module.exports = {
  startPresentationEventConsumers: startEventConsumers
}