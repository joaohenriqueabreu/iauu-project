const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');

const CalculateStatisticService = require('./base');
const CacheManagerService = require('../utils/cacheManager');
const StatisticsHelper = require('../utils/statisticsHelper');
const { User, Artist, Presentation, Statistic } = require('../../models');

module.exports = class CalculateAppUsersStatisticsService extends CalculateStatisticService
{
    constructor(user, data) {
      super(user, data);
      this.cacheSvc = new CacheManagerService(user, 'statistics');
    }

    async calculate() {
      console.log('Calculating app wide presentations statistics...');
      await this.calculateVisits();
      await this.calculateUsers();
      await this.calculateUserRoles();
      await this.calculateYearlySignups();

      return this;
    }

    async calculateVisits() {
      const count = await Statistic.countDocuments({ type: 'visit', created_at: { $gte: this.filters.start, $lte: this.filters.end }});
      const lastMon = await Statistic.countDocuments({ type: 'visit', created_at: { $gte: this.filters.diffPeriods.lastMon.start, $lte: this.filters.diffPeriods.lastMon.end }});
      const prevMon = await Statistic.countDocuments({ type: 'visit', created_at: { $gte: this.filters.diffPeriods.prevMon.start, $lte: this.filters.diffPeriods.prevMon.end }});
      const data = await Statistic.aggregate([
        { $match: { type: 'visit' }},
        { $group: { 
          _id: { year: { $year: "$created_at" } , month: { $month: "$created_at" }, index: { $dateToString: { format: "%Y-%m", date: '$created_at' }}}, 
          value: { $sum: 1 }
        }},
        { $sort: { _id: 1 }}
      ]);

      const diff = this.calculateDiff(lastMon, prevMon);
      this.statistics.visits = { count, diff, data: StatisticsHelper.formatQueryDataset(data, 'value') };
      return this;
    }

    async calculateUsers() {
      const count = await User.countDocuments({ created_at: { $gte: this.filters.start, $lte: this.filters.end }});
      const lastMon = await User.countDocuments({ created_at: { $gte: this.filters.diffPeriods.lastMon.start, $lte: this.filters.diffPeriods.lastMon.end }});
      const prevMon = await User.countDocuments({ created_at: { $gte: this.filters.diffPeriods.prevMon.start, $lte: this.filters.diffPeriods.prevMon.end }});

      const data = await User.aggregate([
        { $group: { 
          _id: { year: { $year: "$created_at" } , month: { $month: "$created_at" }, index: { $dateToString: { format: "%Y-%m", date: '$created_at' }}}, 
          value: { $sum: 1 }
        }},
        { $sort: { _id: 1 }}
      ]);

      const diff = this.calculateDiff(lastMon, prevMon);
      this.statistics.users = { count, diff, data: StatisticsHelper.formatQueryDataset(data, 'value') };
      return this;
    }

    async calculateUserRoles() {
      const data = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } }}]);

      this.statistics.roles = data;
      return this;
    }

    async calculateYearlySignups() {
      const data = await User.aggregate([
        { $group: { 
          _id: { year: { $year: "$created_at" } , month: { $month: "$created_at" }, index: { $dateToString: { format: "%Y-%m", date: '$created_at' }}}, 
          count: { $sum: 1 },
        }},
        { $sort: { _id: 1 }}
      ]);

      this.statistics.signups = {
        data: {
          count: StatisticsHelper.formatQueryDataset(data, 'count')
        }
      }

      return this;
    }

}
