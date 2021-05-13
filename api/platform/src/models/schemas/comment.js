const { Schema, model } = require('mongoose');
const baseSchemaOptions = require('./options');
const BaseRepository    = require('../repositories/base');

const commentsSchema = new Schema({
    comment:  { type: String, required: true },
    owner:    { type: String },    
    photo:    { type: String },
}, baseSchemaOptions);

class Comments extends BaseRepository { }

commentsSchema.loadClass(Comments);
module.exports = model('Comment', commentsSchema);