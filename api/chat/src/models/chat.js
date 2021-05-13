const { Schema, model } = require('mongoose');
const BaseRepository    = require('lib/models/repository');
const baseSchemaOptions = require('lib/models/options');

const messageSchema = require('./schemas/message');

const threadSchema = new Schema({  
  presentation_id: { type: String, required: true },
  messages: [messageSchema],

}, { ...baseSchemaOptions });

class MessageThread extends BaseRepository { }

threadSchema.loadClass(MessageThread)
module.exports = model('Chat', threadSchema)
