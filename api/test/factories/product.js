const faker = require('faker');
const BaseFactory = require('./base');

module.exports = class TimeslotFactory extends BaseFactory {
  constructor(numOfSeeds) {
    super(numOfSeeds);
  }

  manufacture() {
    return {
      name: faker.lorem.sentence(),
      description: faker.lorem.sentences(),
      photo: faker.image.avatar(),
      price: faker.random.number(1000000)
    };
  }
}