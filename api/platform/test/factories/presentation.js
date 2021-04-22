const faker = require('faker');

const BaseFactory = require('./base');
const AddressFactory = require('./address');
const ProposalFactory = require('./proposal');
const ArtistFactory = require('./artist');
const ContractorFactory = require('./contractor');
const { Presentation } = require('../../src/models');

module.exports = class PresentationFactory extends BaseFactory {
  static make() {
    const proposal = ProposalFactory.manufacture();

    return {
      fee:        0.12,
      address:    AddressFactory.manufacture(),
      price:      faker.random.number(1000000),
      proposal:   proposal,
      artist:     ArtistFactory.manufacture(true),
      contractor: ContractorFactory.manufacture(true),
      category:   {
        name: faker.music.genre()
      },
    };
  }

  static makeModel(seed) {
    return new Presentation(seed);
  }
}