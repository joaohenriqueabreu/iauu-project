const faker = require('faker');
const BaseFactory = require('./base');
const { BankAccount } = require('../../src/models/schemas');

module.exports = class BankAccountFactory extends BaseFactory {
  make(document) {
    return new BankAccount({
      // Using pagar.me sample data
      institution: '341',
      agency: '0932',
      number: '58054',
      number_digit: '1',
      document: '26268738888',
      legal_name: 'API BANK ACCOUNT'
    });
  }
}