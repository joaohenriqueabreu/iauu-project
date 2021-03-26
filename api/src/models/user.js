const config = require('../env');
const { Schema, model } = require('mongoose');
const BaseRepository = require('./repositories/base');

const address = require('./schemas/address').schema;
const notification = require("./schemas/notification").schema;
const baseSchemaOptions = require('./schemas/options');

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['artist', 'contractor', 'admin', 'none'], default: 'none' },
  name: { type: String, required: true },
  access_token: { type: String, required: true, select: false },
  status: { type: String, enum: ['pending', 'unassigned', 'assigned', 'active', 'blocked'], default: 'pending' },
  photo: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  accept_terms: { type: Boolean },
  verification: {
    token: { type: String, select: false },
    is_verified: { type: Boolean, default: false },
    issued_at: { type: Date, default: Date.now },
    verified_at: { type: Date }
  },
  reset_token: { type: String, select: false },
  reset_token_expiry: { type: Date },
  admin_token: { type: String }, // Grants access to login as users
  referral: {
    token: { type: String },
    from: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }
  },
  phone: { type: String },
  address: { type: address },
  document: { type: String },
  social: {
    facebook_id: { type: String},
    google_id: { type: String },
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'Artist'
  },
  contractor: {
    type: Schema.Types.ObjectId,
    ref: 'Contractor'
  },
  notifications: [notification],
  last_logged_in: { type: Date },
}, { ...baseSchemaOptions });

class User extends BaseRepository {
  constructor() {
    super();
  }

  static findFromCredentials({ email, password }) {
    return this.findOne({ email, password });
  }

  static fetchdById(id) {
    return this.findById(id)
      .populate('artist')
      .populate('contractor');
  }

  static fetchWithSensitiveDataById(id) {
    return this.findById(id)
      .select('+password +access_token +verification +verification.token')
      .populate('artist')
      .populate('contractor');
  }

  static fetchWithSensitiveData(conditions) {
    return this.findOne(conditions)
      .select('+password +access_token +verification')
      .populate('artist')
      .populate('contractor');
  }

  generateResetPasswordUrl() {
    return `${config.url.web}/reset/password/${this.verification.token}`;
  }

  getRoleId() {
    console.log('Getting role id...');
    if (this.role === 'artist' && this.artist !== undefined) {
      return this.artist.id;
    }

    if (this.role === 'contractor' && this.contractor !== undefined) {
      return this.contractor.id;
    }

    return null;
  }
}

userSchema.index({ email: 'text', name: 'text' });

// https://mongoosejs.com/docs/api.html#schema_Schema-loadClass
userSchema.loadClass(User);
module.exports = model('User', userSchema);
