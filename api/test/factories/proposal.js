const faker = require('faker');

const BaseFactory = require('./base');
const TimeslotFactory = require('./timeslot');
const ProductFactory = require('./product');

module.exports = class ProposalFactory extends BaseFactory {
  make() {
    return {
      title: faker.lorem.sentence(),
      price: faker.random.number(1000000),
      duration: faker.random.number(1000),
      notes: faker.lorem.sentences(5),
      timeslots: (new TimeslotFactory(faker.random.number(5))).getSeeds(),
      product: (new ProductFactory()).getSeed()
    };
  }
}