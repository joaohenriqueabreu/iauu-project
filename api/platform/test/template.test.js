const { moment, sandbox, setup, cleanup } = require('./setup');
const { Presentation } = require('../src/models');
const { PresentationFactory, ArtistFactory, ContractorFactory } = require('./factories');

// Services

// Test-wide objects

describe('Testing template - should not be changed', () => {
  before(async () => { await setup(); })
  after(async () => { await cleanup(); });

  describe('Pre test seeding', () => {
    it('should save models', () => {});
  });

  describe('Service stubs', () => {
    it('should stub methods', () => {});
  });

  describe('Actual tests', () => {
    it('should do something and assert something else', () => {});
  });
});