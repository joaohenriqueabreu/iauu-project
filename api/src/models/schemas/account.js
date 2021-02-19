const db = require('mongoose');
const baseSchemaOptions = require('../schemas/options');

const accountSchema = new db.Schema({
    name: { type: String },
    email: { type: String },
    document: { type: String },
    account_id: { type: String }
}, baseSchemaOptions);

module.exports = accountSchema;