const _ = require('lodash');
const ArtistService = require('./base');
const { Artist, Presentation, Statistic } = require('../../models');

module.exports = class CalculateStatisticsService extends ArtistService
{
    constructor(user, data) {
      super(user, data);

      this.statistics = {};
      this.presentations = [];
    }

    async calculate() {
      await this.lookupArtist();
      await this.ensureArtistWasFound();
      await this.calculateVisits();
      await this.loadPresentations();
      this.countProposals()
        .countPresentations()
        .initIncome()
        .calculatePotentialIncome()
        .calculateActualIncome();
      return this;
    }

    async calculateVisits() {
      const artistRoute = `/search/artists/${this.artist.slug}`;
      const result = await Statistic.countDocuments({ type: 'visit', route: artistRoute });
      this.statistics.visits = result;
      return this;
    }

    async loadPresentations() {
      this.presentations = await Presentation.find({ artist: this.artist.id });
      return this;
    }

    countProposals() {
      this.statistics.proposals = this.presentations.length
      return this
    }

    countPresentations() {
      this.statistics.presentations = _.filter(this.presentations, (presentation) => presentation.status !== 'proposal').length;
      return this;
    }

    initIncome() {
      this.statistics.income = {};
      return this;
    }

    calculatePotentialIncome() {
      this.statistics.income.prevision = _.sumBy(this.presentations, (presentation) => presentation.current_price);
      return this;
    }

    calculateActualIncome() {
      this.statistics.income.actual = _.sumBy(this.presentations, (presentation) => presentation.status !== 'proposal' ? presentation.current_price : 0);
      return this;
    }

    getStatistics() {
      return this.statistics;
    }
}
