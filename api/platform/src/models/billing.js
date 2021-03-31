const _ = require('lodash');
const { Schema, model } = require('mongoose');
const BaseRepository = require('./repositories/base');
const baseSchemaOptions = require('./schemas/options');
const paymentSchema = require('./schemas/payment').schema;
const instalmentSchema = require('./schemas/instalment').schema;
const { BillingData } = require('../config/data');

const billingSchema = new Schema({
// TODO move to own presentation / artist / contractor models for billing micro-service
  presentation: { type: Schema.Types.ObjectId, ref: 'Presentation', required: true },
  contractor: { type: Schema.Types.ObjectId, ref: 'Contractor', required: true },
  artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },

  total_amount: { type: Number, required: true },
  // total_paid: { type: Number, default: 0 },
  fee: { type: Number, required: true },
  status: { type: String, enum: BillingData.BILLING_STATUS, default: BillingData.PENDING_STATUS, required: true },
  instalments: [instalmentSchema],
  payments: [paymentSchema]
}, { ...baseSchemaOptions });

class Billing extends BaseRepository { 
  get is_fully_paid() {
    return this.total_paid >= this.total_amount;
  }

  get is_pending() {
    return this.status === BillingData.PENDING_STATUS;
  }

  get installments() {
    return this.payments.length;
  }

  get amount_due() {
    return this.total_amount - this.total_paid;
  }

  get total_paid() {
    return _.reduce(this.payments, (total, payment) => {
      total += (payment.is_paid ? payment.paid_amount : 0);
      return total;
    }, 0);
  }
}

billingSchema.loadClass(Billing);
module.exports = model('Billing', billingSchema);
