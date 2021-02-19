require('dotenv').config()
// const db = require('../data/db')
const db = require('mongoose')
const BaseRepository = require('./repositories/base')
const baseSchemaOptions = require('./schemas/options')

const messageSchema = require('./schemas/message')

const { Schema } = db

const threadSchema = new Schema({  
  presentation: {
    type: Schema.Types.ObjectId,
    ref: 'Presentation'
  },

  messages: [messageSchema],

}, { ...baseSchemaOptions })

class MessageThread extends BaseRepository {
  constructor() {
    super()
  }
}

threadSchema.loadClass(MessageThread)
module.exports = db.model('Thread', threadSchema)
