PAYMENT_STATUS_PENDING = 'pending';
PAYMENT_STATUS_COMPLETED = 'completed';
PAYMENT_STATUS_FAILED = 'failed';
PAYMENT_STATUS = [PAYMENT_STATUS_PENDING, PAYMENT_STATUS_COMPLETED, PAYMENT_STATUS_FAILED];

PAYMENT_METHOD_TYPE_CREDIT_CARD = 'cc';
PAYMENT_METHOD_TYPE_BOLETO = 'boleto';
PAYMENT_METHOD_TYPE_PIX = 'pix';
PAYMENT_METHODS = [PAYMENT_METHOD_TYPE_CREDIT_CARD, PAYMENT_METHOD_TYPE_BOLETO, PAYMENT_METHOD_TYPE_PIX];

module.exports = {
  PAYMENT_STATUS_PENDING,
  PAYMENT_STATUS_COMPLETED,
  PAYMENT_STATUS_FAILED,
  'PAYMENT_STATUS': PAYMENT_STATUS,

  PAYMENT_METHOD_TYPE_CREDIT_CARD,
  PAYMENT_METHOD_TYPE_BOLETO,
  PAYMENT_METHOD_TYPE_PIX,
  'PAYMENT_METHODS': PAYMENT_METHODS,
}