const faker         = require('faker');
const CounterOffer  = require('../../src/models/schemas/counterOffer');
const BaseFactory   = require('./base');

module.exports = class CounterOfferFactory extends BaseFactory {
  static make() {
    return {
      price:      faker.random.number(99999999),
      duration:   faker.random.number(24),
      status:     'pending',
      notes:      faker.lorem.sentences(),
    };
  }

  static makeModel(seed) {
    return new CounterOffer(seed);
  }
}