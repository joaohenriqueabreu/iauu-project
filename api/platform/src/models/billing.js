const _ = require('lodash');
const { Schema, model } = require('mongoose');
const BaseRepository    = require('./repositories/base');
const baseSchemaOptions = require('./schemas/options');
const paymentSchema     = require('./schemas/payment').schema;
const instalmentSchema  = require('./schemas/instalment').schema;
const { BillingData }   = require('../config/data');

const billingSchema = new Schema({
// TODO move to own presentation / artist / contractor models for billing micro-service
  artist:           { type: Schema.Types.ObjectId, ref: 'ArtistAccount', required: true },
  presentation_id:  { type: String, required: true },
  contractor_id:    { type: String, required: true },

  total_amount:     { type: Number, required: true },
  fee:              { type: Number, required: true },
  status:           { type: String, enum: BillingData.BILLING_STATUS, default: BillingData.PENDING_STATUS, required: true },
  instalments:      [instalmentSchema],
  payments:         [paymentSchema]
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

  // Sum of instalments
  get amount_allocated() {
    return _.sumBy(this.instalments, 'amount');
  }

  get amount_unallocated() {
    return this.total_amount - this.total_paid - this.amount_allocated;
  }

  get has_amount_to_allocate() {
    return this.amount_unallocated > 0;
  }

  get amount_due() {
    return this.total_amount - this.total_paid;
  }

  get has_amount_due() {
    return this.amount_due > 0;
  }

  get total_paid() {
    return _.reduce(this.payments, (total, payment) => {
      total += (! payment.is_failed ? payment.amount : 0);
      return total;
    }, 0);
  }

  getNextInstalmentNum() {
    return this.instalments.length + 1;
  }
}

billingSchema.loadClass(Billing);
module.exports = model('Billing', billingSchema);
