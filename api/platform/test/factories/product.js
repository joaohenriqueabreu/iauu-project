const faker = require('faker');
const { Product } = require('../../src/models/schemas');
const BaseFactory = require('./base');

module.exports = class TimeslotFactory extends BaseFactory {
  static make() {
    return {
      name:         faker.lorem.sentence(),
      description:  faker.lorem.sentences(),
      photo:        faker.image.avatar(),
      price:        faker.random.number(1000000)
    };
  }

  static makeModel(seed) {
    return new Product(seed);
  }
}