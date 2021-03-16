const faker = require('faker');

const { Artist } = require('../../src/models');
const BaseFactory = require('./base');
const GatewayAccountFactory = require('./gatewayAccount');
const AddressFactory = require('./address');
const BankAccountFactory = require('./bankAccount');

module.exports = class ArtistFactory extends BaseFactory {
  // TODO complete seeder
  make() {
    return new Artist({
      id: faker.random.alphaNumeric(16),
      name: faker.name.findName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber('+55##9########'),
      photo: faker.image.avatar(),
      document: faker.random.alphaNumeric(11),
      category: {
        name: faker.lorem.word()
      },
      account: {
        gateway: {},
        bank: (new BankAccountFactory()).getSeed(),
      },
      address: (new AddressFactory()).getSeed(),
    });
  }
}