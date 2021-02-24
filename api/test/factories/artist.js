const faker = require('faker');
const BaseFactory = require('./base');
const { Artist } = require('../../src/models');
const GatewayAccountFactory = require('./gatewayAccount');

module.exports = class ArtistFactory extends BaseFactory {
  // TODO complete seeder
  make() {
    return new Artist({
      name: faker.name.findName(),
      photo: faker.image.avatar(),
      category: {
        name: faker.lorem.word()
      },
      account: {
        gateway: (new GatewayAccountFactory()).getSeed()
      }
    });
  }
}