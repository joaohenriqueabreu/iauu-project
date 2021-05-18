const { Schema, model } = require('mongoose');
const BaseRepository    = require('lib/models/repository');
const baseSchemaOptions = require('lib/models/options');

const messageSchema     = require('./schemas/message').schema;

const chatSchema = new Schema({  
  presentation_id:  { type: String, required: true },
  messages:         [{ type: messageSchema }],
}, baseSchemaOptions);

class Chat extends BaseRepository { }

chatSchema.index({ presentation_id: 'text' });

chatSchema.loadClass(Chat);
module.exports = model('Chat', chatSchema);