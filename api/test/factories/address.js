const faker = require('faker');

const BaseFactory = require('./base');
const { Address } = require('../../src/models/schemas');

module.exports = class AddressFactory extends BaseFactory {
  make() {
    return {
      titla: faker.lorem.sentence(),
      price: faker.random.number(1000000),
      duration: faker.random.number(1000),
      notes: faker.lorem.sentences(5),      
    };
  }
}