const moment              = require('moment');
const { Schema, model }   = require('mongoose');
const baseSchemaOptions   = require('./options');
const { BaseRepository }  = require('../repositories');

const instalmentSchema = new Schema({
    num:        { type: Number, require: true, default: 0 },
    name:       { type: String, default: null }, // i.e.: "Entrada"
    is_upfront: { type: Boolean, default: false },
    due_dt:     { type: Date, required: true },
    amount:     { type: Number, required: true },
    status:     { type: String, enum: ['pending', 'paid'], default: 'pending' },
    notes:      { type: String }
}, baseSchemaOptions)
 
class Instalment extends BaseRepository { 
    get is_paid() {
      return this.status === 'paid';
    }

    get is_delayed() {
      return moment(this.due_dt).diff(moment(), 'days') < 0;
    }
}

instalmentSchema.loadClass(Instalment);
module.exports = model('Instalment', instalmentSchema);