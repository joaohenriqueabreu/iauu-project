// const db = require('../../data/db')
const { Schema, model }   = require('mongoose');
const { BaseRepository }  = require('../repositories');
const baseSchemaOptions   = require('../schemas/options')

const notificationSchema = new Schema({
  from:     { type: db.Schema.Types.ObjectId, ref: 'User' },
  message:  { type: String },
  type:     { type: String, enum: ['user', 'role', 'product', 'presentation', 'proposal']},
  target:   { type: String },
  read:     { type: Boolean, default: false }
}, baseSchemaOptions);

class Notification extends BaseRepository { }
 
notificationSchema.loadClass(Notification);
module.exports = model('Notification', notificationSchema);