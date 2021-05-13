const { Schmea }        = require('mongoose')
const baseSchemaOptions = require('../schemas/options')

module.exports = new Schema({
    product: { type: String },
    item: { type: String },
}, baseSchemaOptions);