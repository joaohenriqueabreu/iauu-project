const _ = require('lodash');

const PagarmeData = require('../../src/config/data/vendor/pagarme');
const { PaymentData } = require('../../src/config/data');

const TestData = require('../config/data');

const { sandbox, setup, cleanup, generalMock } = require('../setup');
const { PaymentFactory, ArtistFactory } = require('../factories');
const PagarmeCreditCardPaymentMethodFactory = require('../factories/vendor/pagarmeCCPaymentMethod');

// Services
const { PagarmeSplitPaymentService, PagarmeUpdatePaymentStatusService, PagarmeCreateBankAccountService, PagarmeCreateRecipientService } = require('../../src/services/gateways');

const { Exception, ManualPaymentRequiredException } = require('../../src/exception');
const { Payment } = require('../../src/models/schemas');
const PagarmeCardHashExchangePaymentService = require('../../src/services/gateways/pagarmeCardHashExchange');
const PagarmeTransactionFactory = require('../factories/vendor/pagarmeTransaction');

// Test-wide objects
let cardHash = null;
let payment, artist, account, transaction, recipient, callbackTransaction = {};

describe('Pagar.me API testing', () => {
  before(async () => { await setup(); });
  // after(async () => { await cleanup(); });

  beforeEach(() => {
    payment = (new PaymentFactory()).getSeed();    

    // change customer (artist) information to allow passing anti-fraud risk check
    // payment.to.document = TestData.pagarme.antifraud.risk.verylow;
    payment.to.document = TestData.pagarme.document.valid.formatted;
  });
  
  describe('Pagar.me API', () => {
    describe('Creating Recipient', () => {
      beforeEach(() => {
        artist = (new ArtistFactory()).getSeed();
      });

      it('should create bank account', async () => {
        artist.account.bank.should.not.be.null;

        // Artist and bank account document should be the same (pagar.me validation)
        artist.account.bank.document = artist.document;
        artist.account.bank.document.should.equal(artist.document);
  
        const pagarmeCreateAccountSvc = new PagarmeCreateBankAccountService();
        account = await pagarmeCreateAccountSvc.create(artist.account.bank);
  
        account.object.should.equal(PagarmeData.PAGARME_RESPONSE_TYPE_BANK_ACCOUNT);      
        account.id.should.not.be.null;
  
        account.bank_code.should.equal(artist.account.bank.institution);
        account.agencia.should.equal(artist.account.bank.agency);
        account.conta.should.equal(artist.account.bank.number);
        account.conta_dv.should.equal(artist.account.bank.number_digit);
        account.document_number.should.equal(artist.account.bank.document);
        account.legal_name.should.equal(artist.account.bank.legal_name);
        account.type.should.equal(PagarmeData.PAGARME_BANK_ACCOUNT_TYPE_CONTA_CORRENTE);
      });
  
      it('should create recipient', async () => {  
        const pagarmeCreateRecipientSvc = new PagarmeCreateRecipientService(account.id);
        recipient = await pagarmeCreateRecipientSvc.create(artist);
        console.log(recipient);
  
        recipient.object.should.equal(PagarmeData.PAGARME_RESPONSE_TYPE_RECIPIENT);
        recipient.id.should.not.be.null;
      });
    });

    describe('Split Payment', () => {
      beforeEach(() => {
        // Update artist gateway info with recipient created info
        payment.to.account.gateway = recipient;
      });

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
        transaction.split_rules.should.not.be.null;
        transaction.split_rules.length.should.equal(2);
        _.forEach(transaction.split_rules, split_rule => split_rule.id.should.not.be.null);
  
        // Make sure metadata has payment id so we can process postback calls
        transaction.metadata.payment_id.should.equal(payment.id);
      });

      it('should call API and create Boleto transaction', async () => {
        const pagarmeSplitPaymentSvc = new PagarmeSplitPaymentService({ type: PaymentData.PAYMENT_METHOD_TYPE_BOLETO });
        const transaction = await pagarmeSplitPaymentSvc.charge(payment);
        
        transaction.should.not.be.null;
        transaction.id.should.not.be.null;
        transaction.status.should.equal(PagarmeData.PAGARME_TRANSACTION_STATUS_WAITING_PAYMENT);
        transaction.boleto_expiration_date.should.not.be.null;
        transaction.boleto_url.should.equal(TestData.pagarme.boleto.url);
        transaction.boleto_barcode.should.equal(TestData.pagarme.boleto.barcode);
      });
  
      it('should call API and create Pix transaction', async () => {
        const pagarmeSplitPaymentSvc = new PagarmeSplitPaymentService({ type: PaymentData.PAYMENT_METHOD_TYPE_PIX });
        const transaction = await pagarmeSplitPaymentSvc.charge(payment);
        
        transaction.should.not.be.null;
        transaction.id.should.not.be.null;
        transaction.status.should.equal(PagarmeData.PAGARME_TRANSACTION_STATUS_WAITING_PAYMENT);
        transaction.pix_qr_code.should.not.be.null;
      });

      it('should require manual payment when payee has no pagar.me recipient account', async () => {
        payment.to.account.gateway = {};
        const pagarmeSplitPaymentSvc = new PagarmeSplitPaymentService({ type: PaymentData.PAYMENT_METHOD_TYPE_CREDIT_CARD, hash: cardHash });

        try {
          await pagarmeSplitPaymentSvc.charge(payment);
        } catch (error) {
          error.should.be.instanceof(ManualPaymentRequiredException);
        }
      });
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

    // it('should fail with invalid payment method', () => {
    //   // const pagarmeSplitPaymentSvc = new PagarmeSplitPaymentService({});
    // });
  });
});