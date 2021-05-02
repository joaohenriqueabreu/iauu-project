const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');

const CalculateStatisticService = require('./base');
const CacheManagerService = require('../utils/cacheManager');
const StatisticsHelper = require('../utils/statisticsHelper');
const { Artist, Presentation, Statistic } = require('../../models');

module.exports = class CalculateStatisticsService extends CalculateStatisticService
{
    constructor(user, data) {
      super(user, data);

      this.id = user.role_id;
      this.artist = {};

      this.cacheSvc = new CacheManagerService(this.artist, 'statistics');
    }

    async calculate() {
      await this.searchArtist();
      this.ensureArtistWasFound();
      
      if (this.hasExistingCacheRecord()) {
        this.statistics = this.retrieveStatisticsFromCache();

        // Don't need to calculate when cache exists
        console.log('Found cache');
        return this;
      }
      
      console.log('No cache found for the given user/key');
      await this.calculateVisits();
      await this.loadPresentations();
      this.countProposals()
        .countPresentations()
        .initIncome()
        .calculateProposalIncome()
        .calculatePresentationIncome()
        .calculateCompletedIncome();

      await this.calculateYearlyFeedbacks();
      await this.calculateYearlyLocations();
      await this.calculateYearlyProposals();
      await this.calculateYearlyPresentations();
      this.cacheStatistics();

      return this;
    }

    async searchArtist() {
      console.log('Searching for artist...')
      this.artist = await Artist.findById(this.id)
      return this
    }

    ensureArtistWasFound() {
      if (Artist.notFound(this.artist) || !this.artist instanceof Artist) {
        throw new Error('Artist not found...')
      }
  
      console.log('Artist found...')
      return this
    }

    async calculateVisits() {
      const artistRoute = `/search/artists/${this.artist.slug}`;
      const count = await Statistic.countDocuments({ type: 'visit', route: artistRoute, create_dt: { $gte: this.filters.start, $lte: this.filters.end }});
      const lastMon = await Statistic.countDocuments({ type: 'visit', route: artistRoute, create_dt: { $gte: this.filters.diffPeriods.lastMon.start, $lte: this.filters.diffPeriods.lastMon.end }});
      const prevMon = await Statistic.countDocuments({ type: 'visit', route: artistRoute, create_dt: { $gte: this.filters.diffPeriods.prevMon.start, $lte: this.filters.diffPeriods.prevMon.end }});
      const data = await Statistic.aggregate([
        { $match: { type: 'visit', route: artistRoute }},
        { $group: { 
          _id: { year: { $year: '$create_dt' } , month: { $month: '$create_dt' }, index: { $dateToString: { format: '%Y-%m', date: '$create_dt' }}}, 
          value: { $sum: 1 }
        }},
        { $sort: { _id: 1 }}
      ]);

      const diff = this.calculateDiff(lastMon, prevMon);
      this.statistics.visits = { 
        count: count, 
        diff: diff, 
        data: StatisticsHelper.formatQueryDataset(data, 'value') 
      };
      return this;
    }

    async loadPresentations() {
      const presentations = await Presentation.find({ artist: this.artist.id, create_dt: { $gte: this.filters.start, $lte: this.filters.end }});
      const lastMon = _.filter(presentations, (presentations) => moment(presentations.create_dt).isBetween(this.filters.diffPeriods.lastMon.start, this.filters.diffPeriods.lastMon.end));
      const prevMon = _.filter(presentations, (presentations) => moment(presentations.create_dt).isBetween(this.filters.diffPeriods.prevMon.start, this.filters.diffPeriods.prevMon.end));

      this.presentations = {
        all: presentations,
        lastMon: lastMon,
        prevMon: prevMon,
      };

      return this;
    }

    countProposals() {
      this.statistics.proposals = {
        count: this.presentations.all.length,
        diff: this.calculateDiff(this.presentations.lastMon.length, this.presentations.prevMon.length)
      }

      return this
    }

    countPresentations() {
      const presentations = _.filter(this.presentations.all, (presentation) => presentation.status !== 'proposal');
      const lastMon = _.filter(this.presentations.lastMon, (presentation) => presentation.status !== 'proposal');
      const prevMon = _.filter(this.presentations.prevMon, (presentation) => presentation.status !== 'proposal');
      
      this.statistics.presentations = {
        count: presentations.length,
        diff: this.calculateDiff(lastMon.length, prevMon.length)
      };

      return this;
    }

    initIncome() {
      this.statistics.income = {};
      return this;
    }

    calculateProposalIncome() {
      const income = _.sumBy(this.presentations.all, (presentation) => presentation.current_price);
      const lastMon = _.sumBy(this.presentations.lastMon, (presentation) => presentation.current_price);
      const prevMon = _.sumBy(this.presentations.prevMon, (presentation) => presentation.current_price);

      this.statistics.income.proposal = {
        value: income,
        diff: this.calculateDiff(lastMon, prevMon)
      }

      return this;
    }

    calculatePresentationIncome() {
      const income = _.sumBy(this.presentations.all, (presentation) => !['proposal', 'rejected'].includes(presentation.status) ? presentation.price : 0);
      const lastMon = _.sumBy(this.presentations.lastMon, (presentation) => !['proposal', 'rejected'].includes(presentation.status) ? presentation.price : 0);
      const prevMon = _.sumBy(this.presentations.prevMon, (presentation) => !['proposal', 'rejected'].includes(presentation.status) ? presentation.price : 0);

      this.statistics.income.presentation = {
        value: income,
        diff: this.calculateDiff(lastMon, prevMon)
      }

      return this;
    }

    calculateCompletedIncome() {
      const income = _.sumBy(this.presentations.all, (presentation) => presentation.status === 'completed' ? presentation.price : 0);
      const lastMon = _.sumBy(this.presentations.lastMon, (presentation) => presentation.status === 'completed' ? presentation.price : 0);
      const prevMon = _.sumBy(this.presentations.prevMon, (presentation) => presentation.status === 'completed' ? presentation.price : 0);

      this.statistics.income.completed = {
        value: income,
        diff: this.calculateDiff(lastMon, prevMon)
      }

      return this;
    }

    async calculateYearlyFeedbacks() {
      const data = await Artist.aggregate([
        { $match: { _id: this.artist._id }},
        { $unwind: '$feedbacks' },
        { $group: { 
          _id: { year: { $year: '$feedbacks.create_dt' } , month: { $month: '$feedbacks.create_dt' }, index: { $dateToString: { format: '%Y-%m', date: '$feedbacks.create_dt' }}}, 
          avg: { $avg: '$feedbacks.rating' },
        }},
        { $sort: { _id: 1 }}
      ]);

      this.statistics.feedbacks = {
        data: {
          avg: StatisticsHelper.formatQueryDataset(data, 'avg')
        }
      }

      return this;
    }

    async calculateYearlyLocations() {
      const data = await Presentation.aggregate([
        { $match: { artist: this.artist._id }},
        { $group: { 
          _id: { state: '$address.state' }, 
          value: { $sum: 1 },
        }},
        { $sort: { _id: 1 }}
      ]);

      this.statistics.location = {
        data: {
          count: data
        }
      }
    }

    async calculateYearlyProposals() {
      const data = await Presentation.aggregate([
        { $match: { artist: this.artist._id }},
        { $group: { 
          _id: { year: { $year: '$proposal.create_dt' } , month: { $month: '$proposal.create_dt' }, index: { $dateToString: { format: '%Y-%m', date: '$proposal.create_dt' }}}, 
          count: { $sum: 1 },
          sum: { $sum: '$proposal.price' }
        }},
        { $sort: { _id: 1 }}
      ]);

      this.statistics.proposals.data = {
        count: StatisticsHelper.formatQueryDataset(data, 'count'),
        sum: StatisticsHelper.formatQueryDataset(data, 'sum'),
      }
    }

    async calculateYearlyPresentations() {
      const data = await Presentation.aggregate([
        { $match: { artist: this.artist._id, status: { $nin: ['proposal', 'rejected'] }}},
        { $group: { 
          _id: { year: { $year: '$create_dt' } , month: { $month: '$create_dt' }, index: { $dateToString: { format: '%Y-%m', date: '$create_dt' }}}, 
          count: { $sum: 1 },
          sum: { $sum: '$price' }
        }},
        { $sort: { _id: 1 }}
      ]);

      this.statistics.presentations.data = {
        count: StatisticsHelper.formatQueryDataset(data, 'count'),
        sum: StatisticsHelper.formatQueryDataset(data, 'sum'),
      }
    }

    getStatistics() {
      return this.statistics;
    }
}
