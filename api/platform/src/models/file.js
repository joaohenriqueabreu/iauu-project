const { Schema, model } = require('mongoose');
const baseSchemaOptions = require('./schemas/options');
const BaseRepository    = require('./repositories/base');

const fileSchema = new Schema({
    url:      { type: String, required: true },
    name:     { type: String },
    type:     { type: String },
    category: { type: String },
    size:     { type: String },
}, baseSchemaOptions);

class File extends BaseRepository {}

fileSchema.loadClass(File);
module.exports = model('File', fileSchema);