const { sandbox, setup, cleanup, generalMock } = require('./setup');
const { PresentationFactory, UserFactory, ArtistFactory, ContractorFactory } = require('./factories');

// Services
const CompletePresentationService = require('../src/services/presentation/completePresentation');
const InitiatePaymentService = require('../src/services/payment/initiatePayment');

// Test-wide objects
let user = {};
let artist = {};
let contractor = {};
let presentation = {};

describe('Payment testing', () => {
  before(async () => { await setup(); });
  // after(async () => { await cleanup(); });

  beforeEach(() => {
    user.artist = artist;
    presentation.artist = artist;
    presentation.contractor = contractor;
  });

  describe('Pre test seeding', () => {
    it('should save models', async () => {
      user = (new UserFactory()).getSeed();
      artist = (new ArtistFactory()).getSeed();
      contractor = (new ContractorFactory()).getSeed();
      presentation = (new PresentationFactory()).getSeed();

      user.artist = artist;
      user.role = 'artist';

      presentation.artist = artist;
      presentation.contractor = contractor;
      presentation.status = 'accepted';

      await user.save();
      await artist.save();
      await contractor.save();
      await presentation.save();
    });
  });

  describe('Service stubs', () => {
    it('should stub methods', () => {
      sandbox.stub(CompletePresentationService.prototype, 'sendMarkedAsCompleteMail').callsFake(generalMock);

      // We will mock creating payment from complete presentation service, so that we can call InitiatePaymentService manually
      sandbox.stub(CompletePresentationService.prototype, 'createPayment').callsFake(generalMock);
    });
  });

  describe('Complete presentation before finalizing payment', () => {
    it('should mark artist confirm status', async () => {
      // First complete presentation from artist
      user.artist = artist;
      user.contractor = {};

      const completePresentationSvc = new CompletePresentationService(user, { id: presentation.id });
      await completePresentationSvc.complete();

      const completedPresentation = completePresentationSvc.getPresentation();
      completedPresentation.confirm_status.should.be.an('array');
      completedPresentation.confirm_status[0].should.equal('artist');
      completedPresentation.status.should.not.equal('completed');
    });

    it('should mark contractor confirm status', async () => {
      user.contractor = contractor;
      user.artist = {};
      user.role = 'contractor';

      const completePresentationSvc = new CompletePresentationService(user, { id: presentation.id });
      await completePresentationSvc.complete();

      const completedPresentation = completePresentationSvc.getPresentation();
      completedPresentation.confirm_status.should.be.an('array');
      completedPresentation.confirm_status[0].should.equal('artist');
      completedPresentation.confirm_status[1].should.equal('contractor');

      // At least confirm that createPayment was called
      CompletePresentationService.prototype.createPayment.should.have.been.calledOnce;

      // Refresh global presentation object
      presentation = completedPresentation;
    });

    it('should have marked presentation status complete', () => {
      presentation.status.should.equal('completed');
    });
  });

  describe('Initiate Payment', () => {
    it('should save invoice', async () => {
      const initPaymentSvc = new InitiatePaymentService(user, { id: presentation.id });
      await initPaymentSvc.initiate();
    });
  });
});