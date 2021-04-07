// const db = require('../../data/db')
const { Schema, model } = require('mongoose');
const baseSchemaOptions = require('./options');
const BaseRepository = require('../base');

const instalmentSchema = new Schema({
    num:        { type: Number, require: true, default: 0 },
    name:       { type: String, default: null }, // i.e.: "Entrada"
    is_upfront: { type: Boolean, default: false },
    due_at:     { type: Date, required: true },
    amount:     { type: Number, required: true },
    status:     { type: String, enum: ['pending', 'paid'] },
    notes:      { type: String }
}, baseSchemaOptions)
 
class Instalment extends BaseRepository { }

instalmentSchema.loadClass(Instalment);
module.exports = model('Instalment', instalmentSchema);