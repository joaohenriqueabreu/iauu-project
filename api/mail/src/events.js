const { EVENTS, EventConsumer } = require('iauu/events');
const {
  UserRegisteredMailService, 
  UserVerifiedMailService,
  // ForgotPwdMailService, 
  // ResetPwdMailService, 
  // ProposalAcceptedMailService, 
  // PresentationCreatedMailService 
} = require('./services');

const userRegisteredConsumer      = new EventConsumer(EVENTS.USER_REGISTERED_EVENT);
const userVerifiedConsumer        = new EventConsumer(EVENTS.USER_VERIFIED_EVENT);
// const forgotPasswordConsumer      = new EventConsumer(EVENTS.FORGOT_PASSWORD_EVENT);
// const resetPasswordConsumer       = new EventConsumer(EVENTS.RESET_PASSWORD_EVENT);
// const firstUserLoginConsumer      = new EventConsumer(EVENTS.FIRST_USER_LOGIN_EVENT);
// const proposalAcceptedConsumer    = new EventConsumer(EVENTS.PROPOSAL_ACCEPTED_EVENT);
// const presentationCreatedConsumer = new EventConsumer(EVENTS.PRESENTATION_CREATED_EVENT);

const userRegisteredMailSvc = new UserRegisteredMailService();
const userVerifiedMailSvc   = new UserVerifiedMailService();

const startEventConsumers = function () {
  console.log('Listening to mail events...');
  Promise.all([
    userRegisteredConsumer.consume(function (user) { userRegisteredMailSvc.send(user); }),
    userVerifiedConsumer.consume(function (user)   { userVerifiedMailSvc.send(user); }),
    // presentationCreatedConsumer.consume(function (presentation) { sendMailSvc.send(presentation); }),
    // proposalAcceptedConsumer.consume(function (proposal)        { sendMailSvc.send(proposal); })
  ]);
}

module.exports = {
  startEventConsumers: startEventConsumers
}