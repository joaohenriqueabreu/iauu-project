const _                         = require('lodash');
const { EventConsumerService }  = require('@iauu/events');
const BadRequestException       = require('../../exception/bad');
const { Presentation }          = require('../../models');
const { EVENTS }                = require('@iauu/events');
const { PresentationData } = require('../../config/data');

module.exports = class CreatePresentationService extends EventConsumerService
{
  constructor() { 
    super();

    this.presentation = {};
  }

  async create(proposal) {
    this.proposal = super.cleanup(proposal);
    this.populatePresentation()
      .setPresentationStatus();
    await this.savePresentation();

    this.emitEvent(EVENTS.PRESENTATION_CREATED_EVENT, this.presentation);
  }

  populatePresentation() {
    // Populate from proposal
    this.presentation = new Presentation(this.proposal);

    // special handling
    this.presentation.timeslot    = this.proposal.selected_timeslot;
    this.presentation.proposal_id = this.proposal.id;
    return this;
  }

  setPresentationStatus() {
    this.presentation.status = PresentationData.PRESENTATION_STATUS_ACCEPTED;
    return this;
  }

  async savePresentation() {
    try {
      await this.presentation.save();
    } catch (error) {
      console.log(error);
    }

    return this;
  }
}
