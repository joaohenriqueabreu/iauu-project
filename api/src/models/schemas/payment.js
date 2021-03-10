require('dotenv').config();

const db = require('mongoose');
const BaseRepository = require('../repositories/base');
const baseSchemaOptions = require('./options');
const { PaymentData } = require('../../config/data');

const { Schema } = db;

const paymentSchema = new Schema({
  from: { 
    type: Schema.Types.ObjectId,
    ref: 'Contractor', 
    required: true 
  },
  to: { 
    type: Schema.Types.ObjectId,
    ref: 'Artist', 
    required: true
  },

  amount: { type: Number, required: true },
  net_amount: { type: Number, required: true },
  paid_amount: { type: Number, default: 0 },
  fee: { type: Number, required: true },
  status: { type: String, enum: PaymentData.PAYMENT_STATUS, required: true, default: PaymentData.PAYMENT_STATUS_PENDING },
  failed_reason: { type: String },
  notes: { type: String },
  method: { any: Schema.Types.Mixed }, // TODO fix this for own payment method - should be transalated by callback interface
  transaction: {any: Schema.Types.Mixed }, // Store response callback data from vendor gateway (can be any format - depends on the vendor gateway)
}, { ...baseSchemaOptions })

class Payment extends BaseRepository { }

paymentSchema.loadClass(Payment);
module.exports = db.model('Payment', paymentSchema);
