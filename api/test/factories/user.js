const faker = require('faker');
const BaseFactory = require('./base');
const AddressFactory = require('./address');
const { User } = require('../../src/models');

module.exports = class UserFactory extends BaseFactory {
  constructor(numOfSeeds) {
    super(numOfSeeds);
  }

  manufacture() {
    return new User({
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.findName(),
      access_token: faker.random.alphaNumeric(16),
      status: 'active',
      photo: faker.image.avatar(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      accept_terms: true,
      verification: {
        token: faker.random.alphaNumeric(16),
        is_verified: true,
        issued_at: faker.date.recent(),
        verified_at: faker.date.recent()
      },      
      phone: faker.phone.phoneNumber(),
      address: (new AddressFactory()).getSeed(),
      document: faker.random.alphaNumeric(15),      
      // artist / contractor HAVE to be assigned
    });
  }
}