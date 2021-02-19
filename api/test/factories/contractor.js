const faker = require('faker');
const BaseFactory = require('./base');
const { Contractor } = require('../../src/models');

module.exports = class ContractorFactory extends BaseFactory {
  constructor(numOfSeeds) {
    super(numOfSeeds);
  }

  // TODO complete seeder
  manufacture() {
    return new Contractor({
      name: faker.name.findName(),
      photo: faker.image.avatar(),
      category: {
        name: faker.lorem.word()
      }
    });
  }
}