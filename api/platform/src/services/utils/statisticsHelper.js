const _ = require('lodash');
const moment = require('moment');

const BaseService = require('../base');

module.exports = class CacheManagerService extends BaseService {
  constructor() {
    super();
  }

  static formatQueryDataset(data, fieldName) {
    // Format dataset (last 12 months, including current mon)
    const dataset = [];
    for (let m = 12; m >= 0; m--) {
      const date = moment().subtract(m, 'months');
      const index = date.format('YYYY-MM');
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
}