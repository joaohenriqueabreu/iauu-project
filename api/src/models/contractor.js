const { Schema, model } = require('mongoose');
const BaseRepository = require('./repositories/base');

const baseSchemaOptions = require('./schemas/options');
const addressSchema = require('./schemas/address').schema;
const bankAccountSchema = require('./schemas/bankAccount').schema;
const gatewayAccountSchema = require('./schemas/gatewayAccount').schema;

const contractorSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  name: { type: String},
  photo: { type: String },
  phone: { type: String }, 
  address: {type: addressSchema},
  account: {
    bank: bankAccountSchema,
    gateway: gatewayAccountSchema
  }
}, { ...baseSchemaOptions });

class Contractor extends BaseRepository {
  constructor(data) { super(data); }
}

contractorSchema.loadClass(Contractor);
module.exports = model('Contractor', contractorSchema);
