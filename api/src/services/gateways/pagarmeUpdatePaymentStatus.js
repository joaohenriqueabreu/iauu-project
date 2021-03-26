const PagarmeData = require('../../config/data/vendor/pagarme');
const { PaymentData } = require('../../config/data');

const { Exception, InvalidPaymentMethodProvidedException, FailedAPIConnectionException, FailedChargingPaymentMethodException, BadRequestException } = require('../../exception');
const VendorGatewayCallbackInterface = require('../interfaces/vendorGatewayCallback');

const PAGARME_PAYMENT_STATUS_MAP = {};
PAGARME_PAYMENT_STATUS_MAP[PagarmeData.PAGARME_TRANSACTION_STATUS_PROCESSING] = PaymentData.PAYMENT_STATUS_PENDING;
PAGARME_PAYMENT_STATUS_MAP[PagarmeData.PAGARME_TRANSACTION_STATUS_AUTHORIZED] = PaymentData.PAYMENT_STATUS_PENDING;
PAGARME_PAYMENT_STATUS_MAP[PagarmeData.PAGARME_TRANSACTION_STATUS_WAITING_PAYMENT] = PaymentData.PAYMENT_STATUS_PENDING;
PAGARME_PAYMENT_STATUS_MAP[PagarmeData.PAGARME_TRANSACTION_STATUS_PENDING_REFUND] = PaymentData.PAYMENT_STATUS_PENDING;
PAGARME_PAYMENT_STATUS_MAP[PagarmeData.PAGARME_TRANSACTION_STATUS_PENDING_REVIEW] = PaymentData.PAYMENT_STATUS_PENDING;
PAGARME_PAYMENT_STATUS_MAP[PagarmeData.PAGARME_TRANSACTION_STATUS_ANALYZING] = PaymentData.PAYMENT_STATUS_PENDING;

PAGARME_PAYMENT_STATUS_MAP[PagarmeData.PAGARME_TRANSACTION_STATUS_PAID] = PaymentData.PAYMENT_STATUS_COMPLETED;
PAGARME_PAYMENT_STATUS_MAP[PagarmeData.PAGARME_TRANSACTION_STATUS_REFUNDED] = PaymentData.PAYMENT_STATUS_COMPLETED;
PAGARME_PAYMENT_STATUS_MAP[PagarmeData.PAGARME_TRANSACTION_STATUS_CHARGED_BACK] = PaymentData.PAYMENT_STATUS_COMPLETED;

PAGARME_PAYMENT_STATUS_MAP[PagarmeData.PAGARME_TRANSACTION_STATUS_REFUSED] = PaymentData.PAYMENT_STATUS_FAILED;

module.exports = class PagarmeUpdatePaymentStatusService extends VendorGatewayCallbackInterface {
  constructor(payment) {
    super();

    if (payment === undefined) {
      throw new BadRequestException('Missing required data');
    }

    this.payment = payment;
  }

  async update(transaction) {
    this.transaction = transaction;

    this.validateTransaction()
      .translateTransactionStatus()
      .updatePaidAmount()
      .updatePaymentTransaction();

    return this.payment;
  }

  validateTransaction() {
    if (this.transaction === undefined || 
      this.transaction.object !== PagarmeData.PAGARME_RESPONSE_TYPE_TRANSACTION ||
      ! PagarmeData.PAGARME_TRANSACTION_STATUS.includes(this.transaction.status)) {
      
        // Set payment as failed so that it can be reviewed by internal team
      this.payment.status = PaymentData.PAYMENT_STATUS_FAILED;
      throw new FailedChargingPaymentMethodException('Invalid transaction provided');
    }

    return this;
  }

  translateTransactionStatus() {
    this.payment.status = PAGARME_PAYMENT_STATUS_MAP[this.transaction.status];
    return this;
  }

  updatePaidAmount() {
    this.payment.paid_amount += this.transaction.paid_amount;
    return this;
  }

  updatePaymentTransaction() {
    this.payment.transaction = this.transaction;
    return this;
  }
}