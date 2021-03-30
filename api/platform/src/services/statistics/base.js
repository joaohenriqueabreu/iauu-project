const _ = require('lodash');
const moment = require('moment');

const BaseService = require('../base');
const CacheManagerService = require('../utils/cacheManager');
const { Artist, Presentation, Statistic } = require('../../models');

module.exports = class CalculateStatisticsService extends BaseService
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

    calculateDiff(current, last) {
      if (current === 0 && last === 0) { return 0; }
      if (last === 0) { return 100; }

      return ((current - last)/last).toFixed(2) * 100;
    }

    getStatistics() {
      return this.statistics;
    }
}
