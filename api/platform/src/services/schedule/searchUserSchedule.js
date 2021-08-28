const _                     = require('lodash');
const { get }               = require('@iauu/request');
const SearchScheduleService = require('./searchSchedule');

module.exports = class SearchUserScheduleService extends SearchScheduleService
{
  constructor(id) {
    super(id);

    this.presentations  = [];
    this.proposals      = [];
  }

  async search(data) {
    this.buildDateQuery(data);
    await this.searchArtist();
    this.ensureArtistWasFound();
    await Promise.all([this.searchPresentations(), this.searchProposals()]);
      
    this.populateProposalSchedule()
      .populatePresentationSchedule()
      .populateYearSchedule(this.year);

    return this;
  }

  // TODO include status in queries
  async searchPresentations() {
    this.presentations = await get('presentations/role', this.id);
    return this;
  }

  async searchProposals() {
    // Build query string
    const query = { ...this.query, status: 'proposal' };

    this.proposals = await get('/proposals/role', this.id, query);
    return this;
  }

  populateProposalSchedule() {
    const proposals         = _.filter(this.proposals, (proposal) => proposal.is_open);
    const proposalTimeslots = _.map(proposals, 'timeslots');

    this.schedule = [...this.schedule, ...proposalTimeslots];  
    return this;
  }

  populatePresentationSchedule() {
    const presentations         = _.filter(this.presentations, (presentation) => presentation.is_contracted);
    const presentationTimeslots = _.map(presentations, 'timeslot');

    this.schedule = [...this.schedule, ...presentationTimeslots];
    return this;
  }
}
