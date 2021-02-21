require('dotenv').config();

const db = require('mongoose');
const BaseRepository = require('./repositories/base');
const baseSchemaOptions = require('./schemas/options');

const proposalSchema = require('./schemas/proposal').schema;
const addressSchema = require('./schemas/address').schema;

const { Schema } = db;

const notificationSchema = new Schema({  
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  title: { type: String, required: true },
  link: { type: String, required: true }
}, { ...baseSchemaOptions })

class Notification extends BaseRepository { }

notificationSchema.loadClass(Notification);
module.exports = db.model('Notification', notificationSchema);
