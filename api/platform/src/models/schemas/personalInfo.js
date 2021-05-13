const { Schema }        = require('mongoose')
const address           = require('./address')
const baseSchemaOptions = require('../schemas/options')

const accountSchema = new Schema({
  phone: { type: String },
  address: { type: address },
  document: { type: String },
}, baseSchemaOptions)
 
module.exports = accountSchema