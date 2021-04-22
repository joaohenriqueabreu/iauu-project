const faker = require('faker');

const BaseFactory     = require('./base');
const TimeslotFactory = require('./timeslot');
const ProductFactory  = require('./product');
const AddressFactory  = require('./address');
const { Proposal } = require('../../src/models');

module.exports = class ProposalFactory extends BaseFactory {
  static make() {
    const numOfTimeslots = faker.random.number(5) + 1;
    return {
      title:      faker.lorem.sentence(),
      status:     'proposal',
      price:      faker.random.number(1000000),
      duration:   faker.random.number(1000),
      notes:      faker.lorem.sentences(5),
      timeslots:  TimeslotFactory.manufacture(true, numOfTimeslots),
      product:    ProductFactory.manufacture(),
      address:    AddressFactory.manufacture(),
    };
  }

  static makeModel(seed) {
    return new Proposal(seed);
  }
}