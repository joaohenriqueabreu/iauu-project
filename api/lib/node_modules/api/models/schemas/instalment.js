// const db = require('../../data/db')
const { Schema, model } = require('mongoose');
const baseSchemaOptions = require('./options');
const BaseRepository = require('../base');

const instalmentSchema = new Schema({
    num: { type: Number, require: true, default: 0 },
    due_dt: { type: Date, required: true },
    amount: { type: Number, required: true },
    notes: { type: String }
}, baseSchemaOptions)
 
class Instalment extends BaseRepository { }

instalmentSchema.loadClass(Instalment);
module.exports = model('Instalment', instalmentSchema);