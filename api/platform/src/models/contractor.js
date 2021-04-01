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
}, { ...baseSchemaOptions });

class Contractor extends BaseRepository {
  get has_pending_required_payment_information() {
    return this.phone == null || 
      this.address == null || 
      this.address.has_pending_required_payment_information;
  }

  get manager() {
    return this.users[0];
  }
}

contractorSchema.loadClass(Contractor);
module.exports = model('Contractor', contractorSchema);
