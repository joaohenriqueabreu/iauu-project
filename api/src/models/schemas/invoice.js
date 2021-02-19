const db = require('mongoose');
const BaseRepository = require('../repositories/base');
const baseSchemaOptions = require('./options');
const paymentSchema = require('./payment').schema;

const { Schema } = db;

const PENDING_STATUS = 'pending';
const COMPLETED_STATUS = 'completed';
const FAILED_STATUS = 'failed';
const INVOICE_STATUS = [PENDING_STATUS, COMPLETED_STATUS, FAILED_STATUS];

const invoiceSchema = new Schema({  
  total_amount: { type: Number, required: true },
  fee: { type: Number, required: true },
  status: { type: String, enum: INVOICE_STATUS, required: true },
  payments: [paymentSchema]
}, { ...baseSchemaOptions });

class Invoice extends BaseRepository { }

invoiceSchema.loadClass(Invoice);
module.exports = db.model('Invoice', invoiceSchema);
