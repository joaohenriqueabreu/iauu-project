const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const ArtistService = require('./base');
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
    }

    async calculate() {
      await this.lookupArtist();
      this.ensureArtistWasFound();
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
      const count = await Statistic.countDocuments({ type: 'visit', route: artistRoute, created_at: { $gte: this.filters.start, $lte: this.filters.end }});
      const lastMon = await Statistic.countDocuments({ type: 'visit', route: artistRoute, created_at: { $gte: this.filters.diffPeriods.lastMon.start, $lte: this.filters.diffPeriods.lastMon.end }});
      const prevMon = await Statistic.countDocuments({ type: 'visit', route: artistRoute, created_at: { $gte: this.filters.diffPeriods.prevMon.start, $lte: this.filters.diffPeriods.prevMon.end }});
      const data = await Statistic.aggregate([
        { $match: { type: 'visit', route: artistRoute }},
        { $group: { _id: { year: { $year: "$created_at" } , month: { $month: "$created_at" }, index: { $dateToString: { format: "%Y-%m", date: '$created_at' }}}, count: { $sum: 1 }}},
        { $sort: { _id: 1 }}
      ]);

      // Format dataset (last 12 months)
      const dataset = [];
      for (let m = 12; m > 0; m--) {
        const date = moment().subtract(m, 'months');
        const index = date.format('YYYY-MM');
        const dataIdx = _.findIndex(data, (item) => { return item._id.index === index; });
        let count = 0;

        if (dataIdx !== -1)  { count = data[dataIdx].count; }
        dataset.push({ 
          year: date.year(), 
          month: date.month(), 
          index: index, 
          label: `${date.format('MMM')} ${date.format('YY')}`, 
          count: count
        })
      }

      const diff = this.calculateDiff(lastMon, prevMon);
      this.statistics.visits = { count, diff, data: dataset };
      return this;
    }

    async loadPresentations() {
      const presentations = await Presentation.find({ artist: this.artist.id });
      const lastMon = _.filter(presentations, (presentations) => moment(presentations.created_at).isBetween(this.filters.diffPeriods.lastMon.start, this.filters.diffPeriods.lastMon.end));
      const prevMon = _.filter(presentations, (presentations) => moment(presentations.created_at).isBetween(this.filters.diffPeriods.prevMon.start, this.filters.diffPeriods.prevMon.end));

      this.presentations = {
        all: presentations,
        lastMon: lastMon,
        prevMon: prevMon
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

    calculatePotentialIncome() {
      const income = _.sumBy(this.presentations.all, (presentation) => presentation.current_price);
      const lastMon = _.sumBy(this.presentations.lastMon, (presentation) => presentation.current_price);
      const prevMon = _.sumBy(this.presentations.prevMon, (presentation) => presentation.current_price);

      this.statistics.income.prevision = {
        value: income,
        diff: this.calculateDiff(lastMon, prevMon)
      }

      return this;
    }

    calculateActualIncome() {
      const income = _.sumBy(this.presentations.all, (presentation) => presentation.status !== 'proposal' ? presentation.current_price : 0);
      const lastMon = _.sumBy(this.presentations.lastMon, (presentation) => presentation.status !== 'proposal' ? presentation.current_price : 0);
      const prevMon = _.sumBy(this.presentations.prevMon, (presentation) => presentation.status !== 'proposal' ? presentation.current_price : 0);

      this.statistics.income.actual = {
        value: income,
        diff: this.calculateDiff(lastMon, prevMon)
      }

      return this;
    }

    calculateDiff(current, last) {
      return (last > 0 ? ((current - last)/last) : 1).toFixed(2) * 100;
    }

    getStatistics() {
      return this.statistics;
    }
}
