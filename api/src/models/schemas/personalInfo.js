// const db = require('../../data/db')
const db = require('mongoose')
const address = require('./address')
const baseSchemaOptions = require('../schemas/options')

const accountSchema = new db.Schema({
  phone: { type: String },
  address: { type: address },
  document: { type: String },
}, baseSchemaOptions)
 
module.exports = accountSchema