const config = require('../../env');
const { Schema, model } = require('mongoose');
const BaseRepository    = require('../repositories/base');
const { PaymentData }   = require('../../config/data');
const baseSchemaOptions = require('./options');

const paymentSchema = new Schema({
  amount:         { type: Number, required: true },
  net_amount:     { type: Number, required: true },
  paid_amount:    { type: Number, default: 0 },
  fee:            { type: Number, required: true, default: config.payment.ourFee },
  status:         { type: String, enum: PaymentData.PAYMENT_STATUS, required: true, default: PaymentData.PAYMENT_STATUS_PENDING },
  failed_reason:  { type: String },
  instalment:     { type: Schema.Types.ObjectId, ref: 'Instalment' },
  due_at:         { type: Date },
  paid_at:        { type: Date },
  notes:          { type: String },
  method:         { type: Object, default: null }, // TODO fix this for own payment method - should be transalated by callback interface
  transaction: {type: Object, default: null }, // Store response callback data from vendor gateway (can be any format - depends on the vendor gateway)
}, { ...baseSchemaOptions })

class Payment extends BaseRepository { 
  get display_id() {
    return this.id.substr(-4);
  }

  get payment_code() {
    if (this.method === undefined || this.method === null || this.transaction === undefined || this.transaction === null) { return ''; }

    if (this.method.type === PaymentData.PAYMENT_METHOD_TYPE_BOLETO) {
      return this.transaction.boleto_barcode;
    }

    if (this.method.type === PaymentData.PAYMENT_METHOD_TYPE_PIX) {
      return this.transaction.pix_qr_code;
    }
  }

  get charge_url() {
    if (this.method.type === PaymentData.PAYMENT_METHOD_TYPE_BOLETO) {
      return this.transaction.boleto_url;
    }

    return '';
  }

  get transaction_due_at() {
    if (this.due_at != null) { 
      return this.due_at;
    }

    if (this.method.type === PaymentData.PAYMENT_METHOD_TYPE_BOLETO) {
      return this.transaction.boleto_expiration_date;
    }

    if (this.method.type === PaymentData.PAYMENT_METHOD_TYPE_PIX) {
      return this.transaction.pix_expiration_date;
    }

    return '';
  }

  get is_pending() {
    return this.status === PaymentData.PAYMENT_STATUS_PENDING;
  }

  get is_failed() {
    return this.status === PaymentData.PAYMENT_STATUS_FAILED || this.status === PaymentData.PAYMENT_STATUS_OVERDUE;
  }

  get is_paid() {
    return this.status === PaymentData.PAYMENT_STATUS_COMPLETED;
  }
}

paymentSchema.loadClass(Payment);
module.exports = model('Payment', paymentSchema);
