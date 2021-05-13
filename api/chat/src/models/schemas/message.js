const { Schema }        = require('mongoose');
const baseSchemaOptions = require('lib/models/options');

const messageSchema = new Schema({
    author: { 
        name:   { type: String, required: true },
        photo:  { type: String, required: true },
        id:     { type: String, required: true }
    },
    type: { type: String, enum: ['text', 'emoji', 'file'] },
    data: { type: Object }
}, baseSchemaOptions)
 
module.exports = messageSchema