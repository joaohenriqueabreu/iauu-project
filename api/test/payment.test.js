const _ = require('lodash');
const { sandbox, setup, cleanup, generalMock } = require('./setup');
const { PresentationFactory, UserFactory, ArtistFactory, ContractorFactory, PaymentMethodFactory } = require('./factories');

// Services
const CompletePresentationService = require('../src/services/presentation/completePresentation');
const InitiatePaymentService = require('../src/services/payment/payPresentation');

const { Exception } = require('../src/exception');
const { PagarmeSplitPaymentService } = require('../src/services/gateways');
const { Invoice, Payment } = require('../src/models/schemas');

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
      sandbox.spy(PagarmeSplitPaymentService.prototype, 'charge');
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

      // Refresh global presentation object
      presentation = completedPresentation;
    });

    it('should have marked presentation status complete', () => {
      presentation.status.should.equal('completed');
    });
  });

  describe('Initiate Payment', () => {
    it('should save invoice', async () => {
      const initPaymentSvc = new InitiatePaymentService(user, { 
        id: presentation.id, 
        paymentMethod: (new PaymentMethodFactory()).getSeed()
      });

      await initPaymentSvc.pay();
      const paidPresentation = initPaymentSvc.getPresentation();

      
      paidPresentation.invoice.status.should.equal('pending');
      paidPresentation.invoice.total_amount.should.equal(presentation.price);

      _.forEach(paidPresentation.invoice.payments, (payment) => {
        // TODO should have a cleaner way to assert this
        payment.from._id.toString().should.equal(contractor.id);
        payment.to._id.toString().should.equal(artist.id);
        
        payment.status.should.equal('pending');
        payment.amount.should.equal(presentation.price);
        payment.fee.should.equal(presentation.fee);
        payment.net_amount.should.equal(presentation.price * (1 - presentation.fee));
        payment.should.have.property('transaction');
        payment.should.have.property('method');
      });
    });

    it('should fail without presentation', () => {
      try {
        new InitiatePaymentService(user, {});
      } catch (error) {
        error.should.be.instanceof(Exception);
      }
    });

    it('should fail without payment method', () => {
      try {
        new InitiatePaymentService(user, { id: presentation.id });
      } catch (error) {
        error.should.be.instanceof(Exception);
      }
    });
  });
});