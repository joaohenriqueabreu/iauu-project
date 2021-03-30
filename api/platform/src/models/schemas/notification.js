// const db = require('../../data/db')
const db = require('mongoose')
const baseSchemaOptions = require('../schemas/options')

const notificationSchema = new db.Schema({
  from: { type: db.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String },
  type: { type: String, enum: ['user', 'role', 'product', 'presentation', 'proposal']},
  target: { type: String },
  read: { type: Boolean, default: false }
}, baseSchemaOptions);
 
module.exports = db.model('Notification', notificationSchema);