// const db = require('../../data/db')
const db = require('mongoose');
const baseSchemaOptions = require('../schemas/options');

const bankAccountSchema = new db.Schema({
    institution: { type: String },
    agency: { type: String },
    account: { type: String },
    document: { type: String },
}, baseSchemaOptions)

module.exports = db.model('BankAccount', bankAccountSchema);