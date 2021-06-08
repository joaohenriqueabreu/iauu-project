const BaseService   = require('iauu/services/base');
const fs            = require('fs');
const mailer        = require('../config');
const mustache      = require('mustache');
const { promisify } = require('util');
const path          = require('path');
const config        = require('iauu/env');
const { InterfaceNotImplementedException, Exception } = require('iauu/exception');

const readFileAsync = promisify(fs.readFile);

module.exports = class SendMailService extends BaseService {
    constructor() { 
      super(); 

      // For now all mails will come from our central mail address
      this.from = 'mail@iauu.com.br';
    }

    async send(data) {
      this.setupMail(data)
        .sanitizeData()
        .ensureMailIsSetup();

      await this.buildBody();
      await this.internalSendMail();
    }

    sanitizeData() {
      return this;
    }

    setupMail(data) {
      throw new InterfaceNotImplementedException('Must implement setupMail interface');
    }

    ensureMailIsSetup() {
      if (this.to == null || this.data == null || this.template == null || this.subject == null) {
        throw new Exception('Failed to build mail');
      }

      return this;
    }

    async buildBody() {
      try {        
        const templatePath  = path.join(__dirname, '..', 'templates', `${this.template}.html`);
        const fileContent   = await readFileAsync(templatePath, 'utf8');
        const html          = mustache.render(fileContent, this.data);

        console.log('Rendering mail template...');
        this.html = html;
        
        console.log('Finished reading file...');
        return this;
      } catch (error) {
        console.log('Failed rendering file...');
        console.log(error);
        throw error;
      }
    }

    async internalSendMail() {
      console.log('Starting send mail...');
      await mailer.send(this.to, this.from, `${config.business.name} | ${this.subject}`, this.html);
    }    
}