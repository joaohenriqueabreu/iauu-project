const { Schema, model } = require('mongoose');
const BaseRepository = require('./repositories/base');
const baseSchemaOptions = require('./schemas/options');

const messageSchema = require('./schemas/message');

const threadSchema = new Schema({  
  presentation: {
    type: Schema.Types.ObjectId,
    ref: 'Presentation'
  },

  messages: [messageSchema],

}, { ...baseSchemaOptions });

class MessageThread extends BaseRepository { }

threadSchema.loadClass(MessageThread)
module.exports = model('Thread', threadSchema)
