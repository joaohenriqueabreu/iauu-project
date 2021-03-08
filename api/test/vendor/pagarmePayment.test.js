const _ = require('lodash');
const { sandbox, setup, cleanup, generalMock } = require('../setup');
const { PaymentFactory } = require('../factories');
const PagarmeCreditCardPaymentMethodFactory = require('../factories/vendor/pagarmeCCPaymentMethod');
const PagarmeBoletoPaymentMethodFactory = require('../factories/vendor/pagarmeBoletoPaymentMethod');

// Services
const { PagarmeSplitPaymentService } = require('../../src/services/gateways');

const { Exception } = require('../../src/exception');
const { Payment } = require('../../src/models/schemas');
const PagarmeCardHashExchangePaymentService = require('../../src/services/gateways/pagarmeCardHashExchange');

// Test-wide objects
let cardHash = null;
let payment = {};
let paymentMethod = {};

describe('Payment testing', () => {
  before(async () => { await setup(); });
  // after(async () => { await cleanup(); });

  beforeEach(() => {
    payment = (new PaymentFactory()).getSeed();
  });
  
  describe('Pagar.me API', () => {
    it('should get card hash', async () => {
      const creditCard = (new PagarmeCreditCardPaymentMethodFactory()).getSeed();

      const pagarmeCardHashExchangeSvc = new PagarmeCardHashExchangePaymentService(creditCard);
      await pagarmeCardHashExchangeSvc.exchange();

      cardHash = pagarmeCardHashExchangeSvc.getHash();
      cardHash.should.not.be.null;
    });

    it('should call API and create CC transaction', async () => {
      const pagarmeSplitPaymentSvc = new PagarmeSplitPaymentService({ type: 'cc', hash: cardHash});
      const transaction = await pagarmeSplitPaymentSvc.charge(payment);
      
      transaction.should.not.be.null;
      transaction.id.should.not.be.null;
      transaction.status.should.equal('processing');
    });

    it('should call API and create Boleto transaction', async () => {
      // const pagarmeSplitPaymentSvc = new PagarmeSplitPaymentService({ type: 'boleto', hash: cardHash});
      // const transaction = await pagarmeSplitPaymentSvc.charge(payment);
      
      // transaction.should.not.be.null;
      // transaction.id.should.not.be.null;
      // transaction.status.should.equal('processing');
    });

    it('should fail with invalid payment method', () => {
      // const pagarmeSplitPaymentSvc = new PagarmeSplitPaymentService({});
    });
  });
});