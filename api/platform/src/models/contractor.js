const { Schema, model } = require('mongoose');
const BaseRepository    = require('./repositories/base');

const baseSchemaOptions = require('./schemas/options');
const addressSchema     = require('./schemas/address').schema;

const contractorSchema = new Schema({
  members:  [{ type: Schema.Types.ObjectId, ref: 'User' }],
  name:     { type: String },
  photo:    { type: String },
  phone:    { type: String },
  email:    { type: String },
  document: { type: String },
  address:  { type: addressSchema},
}, { ...baseSchemaOptions });

class Contractor extends BaseRepository {
  get has_pending_required_payment_information() {
    return this.phone == null || 
      this.address == null || 
      this.address.has_pending_required_payment_information;
  }

  get manager() {
    return this.members[0];
  }

  get company_phone() {
    if (this.phone != null)   { return this.phone; }
    if (this.manager != null) { return this.manager.phone; }
    return '';    
  }

  get company_email() {
    if (this.email != null)   { return this.email; }
    if (this.manager != null) { return this.manager.email; }
    return '';
  }

  get company_document() {
    if (this.document != null)  { return this.document; }
    if (this.manager != null)   { return this.manager.document; }
    return '';
  }

  get company_address() {
    if (this.address != null) { return this.address.display; }
    if (this.manager != null) { return this.manager.address.display; }
    return '';
  }
}

contractorSchema.loadClass(Contractor);
module.exports = model('Contractor', contractorSchema);
