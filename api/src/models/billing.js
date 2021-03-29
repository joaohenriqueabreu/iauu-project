const db = require('mongoose');
const BaseRepository = require('./repositories/base');
const baseSchemaOptions = require('./schemas/options');
const paymentSchema = require('../schemas/payment').schema;
const { BillingData } = require('../config/data');

const { Schema } = db;

const billingSchema = new Schema({
  presentation: { 
    id: { type: String, required: true }
  },
  artist: { 
    id: { type: String, required: true },
  },
  contractor: { 
    id: { type: String, required: true }
  },
  total_amount: { type: Number, required: true },
  total_paid: { type: Number, default: 0 },
  fee: { type: Number, required: true },
  status: { type: String, enum: BillingData.BILLING_STATUS, required: true },
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
