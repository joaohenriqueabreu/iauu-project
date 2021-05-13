const moment = require('moment');
const { Statistic } = require('../../models');
const BaseService = require('../base');

module.exports = class SendFeedbackService extends  BaseService
{
    constructor(data) {
      super(null, data);
      this.route = data.route;
      this.ip = data.ip;
      this.statistic = {};
    }

    async save() {
      this.buildStatistic();
      await this.saveStatistic();
      return this;
    }

    buildStatistic() {
      this.statistic = new Statistic();
      this.statistic.route = this.route;
      this.statistic.ip = this.ip;
      this.statistic.type = 'visit';
      this.statistic.date = moment();
      return this;
    }

    async saveStatistic() {
      await this.statistic.save();
      return this;
    }
}
