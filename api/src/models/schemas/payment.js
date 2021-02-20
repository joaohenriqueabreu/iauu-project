require('dotenv').config();
// const db = require('../data/db')
const db = require('mongoose');
const BaseRepository = require('../repositories/base');
const baseSchemaOptions = require('./options');
const accountSchema = require('./gatewayAccount').schema;

const { Schema } = db;

const paymentSchema = new Schema({
  from: { type: accountSchema, required: true },
  to: { type: accountSchema, required: true },

  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true, default: 'pending' },
  notes: { type: String },
  transaction: { type: String },
}, { ...baseSchemaOptions })

class Payment extends BaseRepository { }

paymentSchema.loadClass(Payment);
module.exports = db.model('Payment', paymentSchema);
