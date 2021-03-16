// const db = require('../../data/db')
const db = require('mongoose');
const baseSchemaOptions = require('../schemas/options');

const bankAccountSchema = new db.Schema({
    institution: { type: String },
    agency: { type: String },
    number: { type: String },
    number_digit: { type: String },
    document: { type: String },
    legal_name: { type: String }
}, baseSchemaOptions)

module.exports = db.model('BankAccount', bankAccountSchema);