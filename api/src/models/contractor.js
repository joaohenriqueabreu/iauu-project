require('dotenv').config();
const db = require('mongoose');
const BaseRepository = require('./repositories/base');

const address = require('./schemas/address');
const baseSchemaOptions = require('./schemas/options');
const bankAccountSchema = require('./schemas/bankAccount').schema;
const gatewayAccountSchema = require('./schemas/gatewayAccount').schema;

const { Schema } = db;

const contractorSchema = new Schema({
  users: [{
    type: db.Schema.Types.ObjectId,
    ref: 'User'
  }],

  name: { type: String},
  photo: { type: String },
  phone: { type: String }, 
  address: {type: address},
  account: {
    bank: bankAccountSchema,
    gateway: gatewayAccountSchema
  }
}, { ...baseSchemaOptions });

class Contractor extends BaseRepository {
  constructor(data) { super(data); }
}

contractorSchema.loadClass(Contractor);
module.exports = db.model('Contractor', contractorSchema);
