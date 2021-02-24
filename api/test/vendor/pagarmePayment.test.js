const _ = require('lodash');
const { sandbox, setup, cleanup, generalMock } = require('../setup');
const { PaymentFactory } = require('../factories');

// Services
const { PagarmeSplitPaymentService } = require('../../src/services/gateways');

const { Exception } = require('../../src/exception');
const { Payment } = require('../../src/models/schemas');

// Test-wide objects
let payment = { };

describe('Payment testing', () => {
  before(async () => { await setup(); });
  // after(async () => { await cleanup(); });

  beforeEach(() => {
    payment = (new PaymentFactory()).getSeed();
  });

  describe('Service stubs', () => {
    it('should stub methods', () => {
      // sandbox.stub(CompletePresentationService.prototype, 'sendMarkedAsCompleteMail').callsFake(generalMock);

      // We will mock creating payment from complete presentation service, so that we can call InitiatePaymentService manually
      // sandbox.spy(PagarmeSplitPaymentService.prototype, 'charge');
    });
  });

  describe('Send pagar.me payment ', () => {
    it('should call API and create transaction', async () => {
      const pagarmeSplitPaymentSvc = new PagarmeSplitPaymentService(payment.method);
      const transactionId = await pagarmeSplitPaymentSvc.charge(payment);

      transactionId.should.not.be.null;
    });
  });
});