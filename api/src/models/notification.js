require('dotenv').config()
// const db = require('../data/db')
const db = require('mongoose')
const BaseRepository = require('./repositories/base')
const baseSchemaOptions = require('./schemas/options')

const proposalSchema = require('./schemas/proposal')
const addressSchema = require('./schemas/address')

const { Schema } = db

const notificationSchema = new Schema({  
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  title: { type: String, required: true },
  link: { type: String, required: true }
}, { ...baseSchemaOptions })

class Notification extends BaseRepository {
  constructor() {
    super()
  }
}

notificationSchema.loadClass(Notification)
module.exports = db.model('Notification', notificationSchema)
