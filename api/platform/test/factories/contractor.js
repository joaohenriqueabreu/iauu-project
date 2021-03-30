const faker = require('faker');
const { Contractor } = require('../../src/models');
const BaseFactory = require('./base');
const GatewayAccountFactory = require('./gatewayAccount');
const AddressFactory = require('./address');

module.exports = class ContractorFactory extends BaseFactory {
  // TODO complete seeder
  make() {
    return new Contractor({
      name: faker.name.findName(),
      photo: faker.image.avatar(),
      category: {
        name: faker.lorem.word()
      },
      account: {
        gateway: (new GatewayAccountFactory()).getSeed()
      },
      address: (new AddressFactory()).getSeed(),
    });
  }
}