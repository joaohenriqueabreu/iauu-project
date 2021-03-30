const db = require('mongoose');
const BaseRepository = require('./repositories/base');
const baseSchemaOptions = require('./schemas/options');
const paymentSchema = require('./schemas/payment').schema;
const instalmentSchema = require('./schemas/instalment').schema;
const { BillingData } = require('../config/data');

const { Schema } = db;

const billingSchema = new Schema({
// TODO move to own presentation / artist / contractor models for billing micro-service
  presentation_id: { 
    id: {type: String, required: true },
    title: { type: String, required: true },
    presentation_dt: { type: Date, required: true }
  },
  contractor_id: { 
    id: { type: String, required: true }
  },
  artist: { type: Schema.Types.ObjectId, required: true },
  total_amount: { type: Number, required: true },
  total_paid: { type: Number, default: 0 },
  fee: { type: Number, required: true },
  status: { type: String, enum: BillingData.BILLING_STATUS, default: BillingData.PENDING_STATUS, required: true },
  instalments: [instalmentSchema],
  payments: [paymentSchema]
}, { ...baseSchemaOptions });

class Billing extends BaseRepository { 
  get is_fully_paid() {
    return this.total_paid >= this.total_amount;
  }

  get installments() {
    return this.payments.length;
  }
}

billingSchema.loadClass(Billing);
module.exports = db.model('Billing', billingSchema);
