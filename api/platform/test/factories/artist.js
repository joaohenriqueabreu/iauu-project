const faker = require('faker');

const { Artist } = require('../../src/models');
const BaseFactory = require('./base');
const GatewayAccountFactory = require('./gatewayAccount');
const AddressFactory = require('./address');
const BankAccountFactory = require('./bankAccount');
const UserFactory = require('./user');

module.exports = class ArtistFactory extends BaseFactory {
  // TODO complete seeder
  static make() {
    return {
      name:     faker.name.findName(),
      email:    faker.internet.email(),
      phone:    faker.phone.phoneNumber('+55##9########'),
      photo:    faker.image.avatar(),
      document: '26268738888',
      category: {
        name: faker.lorem.word()
      },
      account: {
        gateway: {},
        bank:   BankAccountFactory.manufacture(),
      },
      address:  AddressFactory.manufacture(),
      users:    UserFactory.manufacture(),
    };
  }

  static makeModel(seed) {
    return new Artist(seed);
  }
}