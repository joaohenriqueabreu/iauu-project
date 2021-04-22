const _                     = require('lodash')
const SearchScheduleService = require('./searchSchedule')

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
    this.presentations = await this.requestEndpointSvc.get(`/presentations/role/${this.id}`);
    return this;
  }

  async searchProposals() {
    this.proposals = await this.requestEndpointSvc.get(`/proposals/role/${this.id}`);
    return this;
  }

  populateProposalSchedule() {
    const proposals = _.filter(this.proposals, (proposal) => proposal.status === 'proposal');

    // Add presentation id info for every timeslot, so we can query it back
    const proposalTimeslots = _.map(proposals, 'timeslots');

    this.schedule = [...this.schedule, ...proposalTimeslots];   
    return this;
  }

  populatePresentationSchedule() {
    const presentations = _.filter(this.presentations, (presentation) => ['accepted', 'completed', 'cancelled'].includes(presentation.status));
    const presentationTimeslots = _.map(presentations, 'timeslot');

    this.schedule = [...this.schedule, ...presentationTimeslots];
    return this;
  }
}
