const { Schema, model } = require('mongoose');
const BaseRepository    = require('./repositories/base');
const baseSchemaOptions = require('./schemas/options');

const addressSchema     = require('./schemas/address').schema;
const bankAccountSchema = require('./schemas/bankAccount').schema;

const artistSchema = new Schema({
  source_id:  { type: String, required: true },
  name:       { type: String, required: true },
  email:      { type: String, required: true },
  document:   { type: String, required: true },
  photo:      { type: String },
  phone:      { type: String },
  rating:     { type: Number },
  address:    addressSchema,
  account:    {
    bank: bankAccountSchema,
    gateway: { type: Object } // This information is returned and formatted by vendor gateway API
  },
}, { ...baseSchemaOptions });

// TODO rename to Artist only when splitting to Billing service
class ArtistAccount extends BaseRepository {
  get unformatted_phone() {
    if (this.phone == null) { return ''; }
    return '+' + this.phone.replace(/[^a-zA-Z0-9]/g, '');
  }

  // TODO mask private data
  get protected_account_data() {
    return this.account;
  }
}

artistSchema.loadClass(ArtistAccount);
module.exports = model('ArtistAccount', artistSchema);