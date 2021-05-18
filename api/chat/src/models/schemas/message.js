const { Schema, model } = require('mongoose');
const baseSchemaOptions = require('lib/models/options');
const BaseRepository    = require('lib/models/repository');

const messageSchema = new Schema({
    author: { 
        name:   { type: String, required: true },
        photo:  { type: String, required: true },
        id:     { type: String, required: true }
    },
    type: { type: String, enum: ['text', 'emoji', 'file'] },
    data: { type: Object }
}, baseSchemaOptions);

class Message extends BaseRepository { }

messageSchema.loadClass(Message);
module.exports = model('Message', messageSchema);