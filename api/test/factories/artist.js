const faker = require('faker');
const BaseFactory = require('./base');
const { Artist } = require('../../src/models');

module.exports = class ArtistFactory extends BaseFactory {
  constructor(numOfSeeds) {
    super(numOfSeeds);
  }

  // TODO complete seeder
  manufacture() {
    return new Artist({
      name: faker.name.findName(),
      photo: faker.image.avatar(),
      category: {
        name: faker.lorem.word()
      }
    });
  }
}