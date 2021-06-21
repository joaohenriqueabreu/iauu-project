const { EventConsumerService } = require('iauu/events');

module.exports = class RegisterPresentationReferralService extends EventConsumerService 
{
  constructor() {
    super();
  }

  async register(presentation) {
    this.presentation = presentation;
    if (! await this.hasReferralToRegister()) { 
      console.log('No presentation party was referred');
      return this; 
    }
    
    await this.ensureSourceIsValid();
    this.createReferral()
      .calculateReferral();    
    await this.registerReferral();
  }

  async hasReferralToRegister() {
    return this;
  }

  async ensureSourceIsValid() {
    return this;
  }

  async createReferral() {
    return this;
  }

  async calculateReferral() {
    return this;
  }
}