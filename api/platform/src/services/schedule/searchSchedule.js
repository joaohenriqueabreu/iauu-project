const _                   = require('lodash')
const BaseService         = require('../base');
const BadRequestException = require('../../exception/bad');

module.exports = class SearchScheduleService extends BaseService
{
    constructor(id) {
      super()

      if (id === undefined) { throw new BadRequestException('Target schedule id is required'); }

      this.id             = id;
      this.artist         = {};

      this.schedule       = [];
      this.presentations  = [];
      this.query          = {};
    }

    async search(data) {
      this.buildDateQuery(data);
      await this.searchArtist();
      this.ensureArtistWasFound();
      await this.searchPresentations(); // For public schedule, only presentations are required
      this.populateYearSchedule(this.year)
        .populateScheduleWithPresentations();

      return this;
    }

    buildDateQuery(data) {
      this.year = data !== undefined && data.year !== undefined ? data.year : new Date().getFullYear();
      // TODO additional query

      this.query = { year: this.year };
      return this;
    }

    async searchArtist() {
      this.artist = await this.requestEndpointSvc.get(`/artists/${this.id}`);
      return this;
    }

    async searchPresentations() {
      this.presentations = await this.requestEndpointSvc.get(`/presentations/role/${this.id}?status=accepted`); 
      return this;
    }

    ensureArtistWasFound() {
      if (this.artist == null) {
        throw new BadRequestException('Artist not found...');
      }
  
      return this;
    }

    populateYearSchedule() {      
      // do nothing for now
      // TODO move this to query
      console.log(`Searching for ${this.year} schedule...`);
      
      this.schedule = _.flatten([...this.schedule, ...this.artist.schedule]);
      console.log(this.schedule);
      return this;
    }

    populateScheduleWithPresentations() {
      const presentationTimeslots = _.map(this.presentations, 'timeslot');

      this.schedule = [...this.schedule, ...presentationTimeslots];
      return this;
    }

    getSchedule() {
      return this.schedule;
    }
}
