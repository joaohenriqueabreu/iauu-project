const _                         = require('lodash');
const { EventConsumerService }  = require('lib/events');
const BadRequestException       = require('../../exception/bad');
const { Presentation }          = require('../../models');
const { EVENTS }                = require('lib/events');

module.exports = class CreatePresentationService extends EventConsumerService
{
  constructor() { 
    super();

    this.presentation = {};
  }

  async create(proposal) {
    this.proposal = proposal;
    this.populatePresentation();
    await savePresentation();

    this.emitEvent(EVENTS.PRESENTATION_CREATED_EVENT, this.presentation);
  }

  populatePresentation() {
    // Populate from proposal
    this.presentation = new Presentation(this.proposal);

    // special handling
    this.presentation.timeslot = this.proposal.selected_timeslot;
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
