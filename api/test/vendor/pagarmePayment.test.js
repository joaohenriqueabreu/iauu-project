const _ = require('lodash');

const PagarmeData = require('../../src/config/data/vendor/pagarme');
const { PaymentData } = require('../../src/config/data');

const testConfig = require('../config/data');

const { sandbox, setup, cleanup, generalMock } = require('../setup');
const { PaymentFactory } = require('../factories');
const PagarmeCreditCardPaymentMethodFactory = require('../factories/vendor/pagarmeCCPaymentMethod');
const PagarmeBoletoPaymentMethodFactory = require('../factories/vendor/pagarmeBoletoPaymentMethod');

// Services
const { PagarmeSplitPaymentService, PagarmeUpdatePaymentStatusService } = require('../../src/services/gateways');

const { Exception } = require('../../src/exception');
const { Payment } = require('../../src/models/schemas');
const PagarmeCardHashExchangePaymentService = require('../../src/services/gateways/pagarmeCardHashExchange');
const PagarmeTransactionFactory = require('../factories/vendor/pagarmeTransaction');

// Test-wide objects
let cardHash = null;
let payment = {};
let transaction = {};
let callbackTransaction = {};
let paymentMethod = {};

describe('Pagar.me API testing', () => {
  before(async () => { await setup(); });
  // after(async () => { await cleanup(); });

  beforeEach(() => {
    payment = (new PaymentFactory()).getSeed();

    // change customer (artist) information to allow passing anti-fraud risk check
    payment.to.document = testConfig.pagarme.antifraud.document.verylow;
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
      const pagarmeSplitPaymentSvc = new PagarmeSplitPaymentService({ type: PaymentData.PAYMENT_METHOD_TYPE_CREDIT_CARD, hash: cardHash});
      transaction = await pagarmeSplitPaymentSvc.charge(payment);
      
      transaction.should.not.be.null;
      transaction.id.should.not.be.null;
      transaction.status.should.equal(PagarmeData.PAGARME_TRANSACTION_STATUS_PROCESSING);

      // Make sure metadata has payment id so we can process postback calls
      transaction.metadata.payment_id.should.equal(payment.id);
    });

    describe('Pagar.me transaction status update postback', () => {
      beforeEach(() => {
        callbackTransaction = (new PagarmeTransactionFactory()).getSeed();
        callbackTransaction.id = transaction.id;
      });

      it('should update payment status to pending', async () => {
        const pagarmeUpdateStatusPaymentSvc = new PagarmeUpdatePaymentStatusService(payment);
        const updatedPayment = await pagarmeUpdateStatusPaymentSvc.update(callbackTransaction);
  
        updatedPayment.status.should.equal(PaymentData.PAYMENT_STATUS_PENDING);
      });

      it('should update payment status to completed', async () => {        
        callbackTransaction.paid_amount = payment.amount;
        callbackTransaction.status = PagarmeData.PAGARME_TRANSACTION_STATUS_PAID;
        console.log(callbackTransaction);

        const pagarmeUpdateStatusPaymentSvc = new PagarmeUpdatePaymentStatusService(payment);
        const updatedPayment = await pagarmeUpdateStatusPaymentSvc.update(callbackTransaction);
  
        updatedPayment.status.should.equal(PaymentData.PAYMENT_STATUS_COMPLETED);
        updatedPayment.paid_amount.should.equal(payment.amount);
      });

      it('should update payment status to failed', async () => {
        callbackTransaction.status = PagarmeData.PAGARME_TRANSACTION_STATUS_REFUSED;

        const pagarmeUpdateStatusPaymentSvc = new PagarmeUpdatePaymentStatusService(payment);
        const updatedPayment = await pagarmeUpdateStatusPaymentSvc.update(callbackTransaction);
  
        updatedPayment.status.should.equal(PaymentData.PAYMENT_STATUS_FAILED);
      });
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