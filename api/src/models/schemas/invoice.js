const db = require('mongoose');
const BaseRepository = require('../repositories/base');
const baseSchemaOptions = require('./options');
const paymentSchema = require('./payment').schema;
const { InvoiceData } = require('../../config/data');

const { Schema } = db;

const invoiceSchema = new Schema({  
  total_amount: { type: Number, required: true },
  fee: { type: Number, required: true },
  status: { type: String, enum: InvoiceData.INVOICE_STATUS, required: true },
  payments: [paymentSchema]
}, { ...baseSchemaOptions });

class Invoice extends BaseRepository { }

invoiceSchema.loadClass(Invoice);
module.exports = db.model('Invoice', invoiceSchema);
