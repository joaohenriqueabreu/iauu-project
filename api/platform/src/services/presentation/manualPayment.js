const _                         = require('lodash');
const { EventConsumerService }  = require('iauu/events');
const { BadRequestException }   = require('iauu/exception');
const { Presentation }          = require('../../models');
const { EVENTS }                = require('iauu/events');
const { PresentationData }      = require('../../config/data');

module.exports = class ManualPaymentService extends EventConsumerService
{
  constructor() { 
    super();

    this.presentation = {};
  }

  async markManual(id) {
    this.id = id;
    await this.searchPresentation();
    this.ensurePresentationWasFound();
    this.setManualPayment();
    await this.savePresentation();
    return this;    
  }

  async searchPresentation() {
    this.presentation = await Presentation.findById(this.id);
    return this;
  }

  ensurePresentationWasFound() {
    if (Presentation.notFound(this.presentation)) {
      throw new BadRequestException('Presentation not found');
    }

    return this;
  }

  setManualPayment() {
    console.log('Setting presentation as manual payment');
    this.presentation.manual_payment = true;
    return this;
  }

  async savePresentation() {    
    await this.presentation.save();
    return this;
  }
}
