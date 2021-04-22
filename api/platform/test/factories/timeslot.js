const faker         = require('faker');
const { Timeslot }  = require('../../src/models/schemas');
const BaseFactory   = require('./base');

module.exports = class TimeslotFactory extends BaseFactory {
  static make() {
    return {
      title:        faker.lorem.sentence(),
      description:  faker.lorem.sentences(5),
      start_dt:     faker.date.recent(),
      end_dt:       faker.date.soon(),
      full_day:     faker.random.boolean(),
      type:         'event'
    };
  }

  static makeModel(seed) {
    return new Timeslot(seed);
  }
}