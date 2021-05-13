const { Schema, model } = require('mongoose');
const baseSchemaOptions = require('../schemas/options');

const bankAccountSchema = new Schema({
    institution: { type: String },
    agency: { type: String },
    number: { type: String },
    number_digit: { type: String },
    document: { type: String },
    legal_name: { type: String }
}, baseSchemaOptions)

module.exports = model('BankAccount', bankAccountSchema);