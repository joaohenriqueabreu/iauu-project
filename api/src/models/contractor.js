require('dotenv').config();
const db = require('mongoose');
const BaseRepository = require('./repositories/base');

const address = require('./schemas/address');
const baseSchemaOptions = require('./schemas/options');
const gatewayAccountSchema = require('./schemas/account');

const { Schema } = db

const contractorSchema = new Schema({
  users: [{
    type: db.Schema.Types.ObjectId,
    ref: 'User'
  }],

  name: { type: String},
  photo: { type: String },
  phone: { type: String }, 
  address: {type: address},
  gateway_account: gatewayAccountSchema,
}, { ...baseSchemaOptions })

class Contractor extends BaseRepository {
  constructor() {
    super()
  }
}

contractorSchema.loadClass(Contractor)
module.exports = db.model('Contractor', contractorSchema)
