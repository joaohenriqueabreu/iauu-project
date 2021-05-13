const config          = require('lib/env');
const SendMailService = require('./base');

module.exports = class UserRegisteredMailService extends SendMailService {
  constructor() { 
    super(); 

    this.template = 'userRegistered';
    this.subject  = 'Confirme seu cadastro';
  }

  setupMail(user) {
    this.user = user;

    this.to   = user.email;    
    this.data = { user: this.user, url: this.generateVerificationUrl() };

    return this;
  }

  generateVerificationUrl() {
    return `${config.url.web}/register/verify/${this.user.verification.token}`;
  }
}