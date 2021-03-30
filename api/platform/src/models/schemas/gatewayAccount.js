const db = require('mongoose');
const baseSchemaOptions = require('./options');

const gatewayAccountSchema = new db.Schema({
    name: { type: String },
    email: { type: String },
    document: { type: String },
    account_id: { type: String }
}, baseSchemaOptions);
 
module.exports = db.model('GatewayAccount', gatewayAccountSchema);