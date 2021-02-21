require('dotenv').config();
// const db = require('../data/db')
const db = require('mongoose');
const BaseRepository = require('../repositories/base');
const baseSchemaOptions = require('./options');

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
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true, default: 'pending' },
  notes: { type: String },
  method: { any: Schema.Types.Mixed }, // Store provided frontend payment method information (can be any format - depends on the vendor gateway)
  transaction: {any: Schema.Types.Mixed }, // Store response callback data from vendor gateway (can be any format - depends on the vendor gateway)
}, { ...baseSchemaOptions })

class Payment extends BaseRepository { }

paymentSchema.loadClass(Payment);
module.exports = db.model('Payment', paymentSchema);
