const { EVENTS, EventConsumer }     = require('iauu/events');
const { 
  CreatePresentationService,
  ManualPaymentService,
} = require('../services/presentation');

const proposalAcceptedConsumer      = new EventConsumer(EVENTS.PROPOSAL_ACCEPTED_EVENT);
const bankAccountNotLinkedConsumer  = new EventConsumer(EVENTS.BANK_ACCOUNT_NOT_LINKED_EVENT);

const createPresentationSvc         = new CreatePresentationService();
const manualPaymentPresentationSvc  = new ManualPaymentService();

const startEventConsumers = function () {
  Promise.all([
    proposalAcceptedConsumer.consume(function (proposal) { createPresentationSvc.create(proposal) }),
    bankAccountNotLinkedConsumer.consume(function (presentationId) { 
      console.log(`Received ${EVENTS.BANK_ACCOUNT_NOT_LINKED_EVENT}`)
      manualPaymentPresentationSvc.markManual(presentationId); 
    })
  ]);
}

module.exports = {
  startPresentationEventConsumers: startEventConsumers
}