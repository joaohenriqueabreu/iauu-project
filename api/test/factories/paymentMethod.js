const faker = require('faker');

const BaseFactory = require('./base');

module.exports = class PaymentMethodFactory extends BaseFactory {

  make() {
    return {
      hash: faker.random.alphaNumeric(16),
      type: 'cc'
    };
  }
}