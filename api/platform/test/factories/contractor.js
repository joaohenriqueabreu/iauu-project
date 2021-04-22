const faker = require('faker');
const { Contractor } = require('../../src/models');
const BaseFactory = require('./base');
const GatewayAccountFactory = require('./gatewayAccount');
const AddressFactory = require('./address');

module.exports = class ContractorFactory extends BaseFactory {
  // TODO complete seeder
  static make() {
    return {
      name:   faker.name.findName(),
      photo:  faker.image.avatar(),
      category: {
        name: faker.lorem.word()
      },
      account: {
        gateway: GatewayAccountFactory.manufacture()
      },
      address: AddressFactory.manufacture(),
    };
  }

  static makeModel(seed) {
    return new Contractor(seed);
  }
}