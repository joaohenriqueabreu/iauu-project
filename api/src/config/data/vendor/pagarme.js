PAGARME_RESPONSE_TYPE_TRANSACTION = 'transaction';
PAGARME_RESPONSE_TYPE_BANK_ACCOUNT = 'bank_account';
PAGARME_RESPONSE_TYPE_RECIPIENT = 'recipient';

// see https://docs.pagar.me/reference#status-das-transacoes
PAGARME_TRANSACTION_STATUS_PROCESSING = 'processing';
PAGARME_TRANSACTION_STATUS_AUTHORIZED = 'authorized';
PAGARME_TRANSACTION_STATUS_PAID = 'paid';
PAGARME_TRANSACTION_STATUS_REFUNDED = 'refunded';
PAGARME_TRANSACTION_STATUS_WAITING_PAYMENT = 'waiting_payment';
PAGARME_TRANSACTION_STATUS_PENDING_REFUND = 'pending_refund';
PAGARME_TRANSACTION_STATUS_REFUSED = 'refused';
PAGARME_TRANSACTION_STATUS_CHARGED_BACK = 'charged_back';
PAGARME_TRANSACTION_STATUS_ANALYZING = 'analyzing';
PAGARME_TRANSACTION_STATUS_PENDING_REVIEW = 'pending_review';

PAYMENT_METHOD_TYPE_CREDIT_CARD='credit_card';
PAYMENT_METHOD_TYPE_BOLETO='boleto';
PAYMENT_METHOD_TYPE_PIX='pix';

PAGARME_BANK_ACCOUNT_TYPE_CONTA_CORRENTE='conta_corrente';

PAGARME_RECIPIENT_TYPE_INDIVIDUAL='individual';
PAGARME_RECIPIENT_TYPE_CORPORATION='corportation';

module.exports = {
  PAGARME_RESPONSE_TYPE_TRANSACTION,
  PAGARME_RESPONSE_TYPE_BANK_ACCOUNT,
  PAGARME_RESPONSE_TYPE_RECIPIENT,

  PAGARME_TRANSACTION_STATUS_PROCESSING,
  PAGARME_TRANSACTION_STATUS_AUTHORIZED,
  PAGARME_TRANSACTION_STATUS_PAID,
  PAGARME_TRANSACTION_STATUS_REFUNDED,
  PAGARME_TRANSACTION_STATUS_WAITING_PAYMENT,
  PAGARME_TRANSACTION_STATUS_PENDING_REFUND,
  PAGARME_TRANSACTION_STATUS_REFUSED,
  PAGARME_TRANSACTION_STATUS_CHARGED_BACK,
  PAGARME_TRANSACTION_STATUS_ANALYZING,
  PAGARME_TRANSACTION_STATUS_PENDING_REVIEW,
  'PAGARME_TRANSACTION_STATUS': [
    PAGARME_TRANSACTION_STATUS_PROCESSING,
    PAGARME_TRANSACTION_STATUS_AUTHORIZED,
    PAGARME_TRANSACTION_STATUS_PAID,
    PAGARME_TRANSACTION_STATUS_REFUNDED,
    PAGARME_TRANSACTION_STATUS_WAITING_PAYMENT,
    PAGARME_TRANSACTION_STATUS_PENDING_REFUND,
    PAGARME_TRANSACTION_STATUS_REFUSED,
    PAGARME_TRANSACTION_STATUS_CHARGED_BACK,
    PAGARME_TRANSACTION_STATUS_ANALYZING,
    PAGARME_TRANSACTION_STATUS_PENDING_REVIEW
  ],
  PAYMENT_METHOD_TYPE_CREDIT_CARD,
  PAYMENT_METHOD_TYPE_BOLETO,
  PAYMENT_METHOD_TYPE_PIX,

  PAGARME_BANK_ACCOUNT_TYPE_CONTA_CORRENTE,

  PAGARME_RECIPIENT_TYPE_INDIVIDUAL,
  PAGARME_RECIPIENT_TYPE_CORPORATION,
}