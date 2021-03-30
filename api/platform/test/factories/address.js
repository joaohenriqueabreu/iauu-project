const faker = require('faker');

const BaseFactory = require('./base');
const { Address } = require('../../src/models/schemas');

module.exports = class AddressFactory extends BaseFactory {
  make() {
    return {
      street: faker.address.streetName(),
      number: faker.random.number(10000),
      neighboorhood: faker.address.county(),
      city: faker.address.city(),
      state: faker.address.stateAbbr(),
      country: faker.address.countryCode().toLowerCase(),
      zipcode: faker.address.zipCode(),
      // TODO manufacture location
    };
  }
}