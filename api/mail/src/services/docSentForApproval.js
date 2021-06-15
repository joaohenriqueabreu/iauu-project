const SendMailService = require('./base');

module.exports = class DocumentSentForApprovalService extends SendMailService {
  constructor() { 
    super(); 

    this.template = 'docSentForApproval';
    this.subject  = 'Documento recebido para aprovacao';
  }

  setupMail({ user, presentation }) {
    this.user = user;

    this.to   = user.email;    
    this.data = { presentation: presentation };

    return this;
  }
}