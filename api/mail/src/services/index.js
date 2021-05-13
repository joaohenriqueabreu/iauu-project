const UserRegisteredMailService       = require('./userRegistered');
const UserVerifiedMailService         = require('./userVerified');
const ForgotPwdMailService            = require('./forgotPassword');
const ResetPwdMailService             = require('./resetPassword');
const ProposalAcceptedMailService     = require('./proposalAccepted');
const PresentationCreatedMailService  = require('./presentationCreated');

module.exports = {
  UserRegisteredMailService,
  UserVerifiedMailService,
  ForgotPwdMailService,
  ResetPwdMailService,
  
  ProposalAcceptedMailService,
  PresentationCreatedMailService
}
