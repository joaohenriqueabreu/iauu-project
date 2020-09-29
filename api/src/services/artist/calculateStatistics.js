const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');

const ArtistService = require('./base');
const CacheManagerService = require('../utils/cacheManager');
const { Artist, Presentation, Statistic } = require('../../models');

module.exports = class CalculateStatisticsService extends ArtistService
{
    constructor(user, data) {
      super(user, data);

      this.statistics = {};
      this.presentations = [];

      this.filters = data;
      if (typeof this.filters !== 'object') { this.filters = {}; }
      if (typeof this.filters.start !== 'string') { this.filters.start = moment().subtract(12, 'months'); }
      if (typeof this.filters.end !== 'string') { this.filters.end = moment(); }

      this.filters.start = moment(this.filters.start).toISOString();
      this.filters.end = moment(this.filters.end).toISOString();

      // LMG - Last month growth
      this.filters.diffPeriods = { 
        lastMon: { 
          start: moment().subtract(1, 'month').startOf('month').toISOString(),
          end: moment().subtract(1, 'month').endOf('month').toISOString(),
        }, 
        prevMon:  {
          start: moment().subtract(2, 'month').startOf('month').toISOString(),
          end: moment().subtract(2, 'month').endOf('month').toISOString(),
        }
      };

      this.cacheSvc = new CacheManagerService(this.artist, 'statistics');
    }

    async calculate() {
      await this.lookupArtist();
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

    hasExistingCacheRecord() {
      return this.cacheSvc.hasCacheRecord();
    }

    retrieveStatisticsFromCache() {
      return this.cacheSvc.retrieve();
    }

    cacheStatistics() {
      this.cacheSvc.store(this.statistics);
      return this;
    }

    async calculateVisits() {
      const artistRoute = `/search/artists/${this.artist.slug}`;
      const count = await Statistic.countDocuments({ type: 'visit', route: artistRoute, created_at: { $gte: this.filters.start, $lte: this.filters.end }});
      const lastMon = await Statistic.countDocuments({ type: 'visit', route: artistRoute, created_at: { $gte: this.filters.diffPeriods.lastMon.start, $lte: this.filters.diffPeriods.lastMon.end }});
      const prevMon = await Statistic.countDocuments({ type: 'visit', route: artistRoute, created_at: { $gte: this.filters.diffPeriods.prevMon.start, $lte: this.filters.diffPeriods.prevMon.end }});
      const data = await Statistic.aggregate([
        { $match: { type: 'visit', route: artistRoute }},
        { $group: { 
          _id: { year: { $year: "$created_at" } , month: { $month: "$created_at" }, index: { $dateToString: { format: "%Y-%m", date: '$created_at' }}}, 
          value: { $sum: 1 }
        }},
        { $sort: { _id: 1 }}
      ]);

      const diff = this.calculateDiff(lastMon, prevMon);
      this.statistics.visits = { count, diff, data: this.formatQueryDataset(data, 'value') };
      return this;
    }

    async loadPresentations() {
      const presentations = await Presentation.find({ artist: this.artist.id, created_at: { $gte: this.filters.start, $lte: this.filters.end }});
      const lastMon = _.filter(presentations, (presentations) => moment(presentations.created_at).isBetween(this.filters.diffPeriods.lastMon.start, this.filters.diffPeriods.lastMon.end));
      const prevMon = _.filter(presentations, (presentations) => moment(presentations.created_at).isBetween(this.filters.diffPeriods.prevMon.start, this.filters.diffPeriods.prevMon.end));

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
        { $unwind: "$feedbacks" },
        { $group: { 
          _id: { year: { $year: "$feedbacks.created_at" } , month: { $month: "$feedbacks.created_at" }, index: { $dateToString: { format: "%Y-%m", date: '$feedbacks.created_at' }}}, 
          avg: { $avg: "$feedbacks.rating" },
        }},
        { $sort: { _id: 1 }}
      ]);

      this.statistics.feedbacks = {
        data: {
          avg: this.formatQueryDataset(data, 'avg')
        }
      }

      return this;
    }

    async calculateYearlyLocations() {
      const data = await Presentation.aggregate([
        { $match: { artist: this.artist._id }},
        { $group: { 
          _id: { state: "$address.state" }, 
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
          _id: { year: { $year: "$proposal.created_at" } , month: { $month: "$proposal.created_at" }, index: { $dateToString: { format: "%Y-%m", date: '$proposal.created_at' }}}, 
          count: { $sum: 1 },
          sum: { $sum: '$proposal.price' }
        }},
        { $sort: { _id: 1 }}
      ]);

      this.statistics.proposals.data = {
        count: this.formatQueryDataset(data, 'count'),
        sum: this.formatQueryDataset(data, 'sum'),
      }
    }

    async calculateYearlyPresentations() {
      const data = await Presentation.aggregate([
        { $match: { artist: this.artist._id, status: { $nin: ['proposal', 'rejected'] }}},
        { $group: { 
          _id: { year: { $year: "$created_at" } , month: { $month: "$created_at" }, index: { $dateToString: { format: "%Y-%m", date: '$created_at' }}}, 
          count: { $sum: 1 },
          sum: { $sum: '$price' }
        }},
        { $sort: { _id: 1 }}
      ]);

      this.statistics.presentations.data = {
        count: this.formatQueryDataset(data, 'count'),
        sum: this.formatQueryDataset(data, 'sum'),
      }
    }


    formatQueryDataset(data, fieldName) {
      // Format dataset (last 12 months, including current mon)
      const dataset = [];
      for (let m = 12; m >= 0; m--) {
        const date = moment().subtract(m, 'months');
        const index = date.format('YYYY-MM');
        // const dataIdx = _.findIndex(data, (item) => { return item._id.index === index; });
        const dataIdx = _.findIndex(data, (item) => { return item._id.index === index; });
        let value = 0;

        if (dataIdx !== -1)  { value = data[dataIdx][fieldName]; }
        dataset.push({ 
          year: date.year(), 
          month: date.month(), 
          index: index, 
          label: `${date.format('MMM')} ${date.format('YY')}`, 
          value: value
        })
      }

      return dataset;
    }

    calculateDiff(current, last) {
      if (current === 0 && last === 0) { return 0; }
      if (last === 0) { return 100; }

      return ((current - last)/last).toFixed(2) * 100;
    }

    getStatistics() {
      return this.statistics;
    }
}
