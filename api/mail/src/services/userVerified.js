const SendMailService = require('./base');

module.exports = class UserVerfifiedMailService extends SendMailService {
  constructor() { 
    super(); 

    this.template = 'userVerified';
    this.subject  = 'Conta verificada com sucesso. Bem vindo a Iauu!';
  }

  setupMail(user) {
    this.user = user;

    this.to   = user.email;    
    this.data = { user: this.user };

    return this;
  }
}