const faker           = require('faker');
const BaseFactory     = require('./base');
const AddressFactory  = require('./address');
const { User }        = require('../../src/models');

module.exports = class UserFactory extends BaseFactory {
  static make() {
    return {
      email:        faker.internet.email(),
      password:     faker.internet.password(),
      name:         faker.name.findName(),
      access_token: faker.random.alphaNumeric(16),
      status:       'active',
      photo:        faker.image.avatar(),
      first_name:   faker.name.firstName(),
      last_name:    faker.name.lastName(),
      accept_terms: true,
      verification: {
        token:        faker.random.alphaNumeric(16),
        is_verified:  true,
        issued_at:    faker.date.recent(),
        verified_at:  faker.date.recent()
      },      
      phone:        faker.phone.phoneNumber(),
      address:      AddressFactory.manufacture(),
      document:     '26268738888', // Fixing CPF so that it gets consistent along Artist and Bank Account
    };
  }

  static makeModel(seed) {
    return new User(seed);
  }
}