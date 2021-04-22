const { Schema, model } = require('mongoose');
const BaseRepository    = require('../repositories/base');
const baseSchemaOptions = require('../schemas/options');

const timeslotSchema = new Schema({
  title:        { type: String },
  description:  { type: String },
  start_dt:     { type: Date },
  end_dt:       { type: Date },
  full_day:     { type: Boolean },
  type:         { type: String, enum: ['event', 'busy']},
  repeat:       { type: String, enum: ['day', 'week', 'month', 'year']},
}, baseSchemaOptions);
 
class Timeslot extends BaseRepository {
  constructor() { super(); }

  get presentation_id() {
    if (this.type === 'busy' || typeof this.ownerDocument != 'function') { return null; }
    return this.ownerDocument().id;
  }

  get artist_id() {
    if (this.type === 'event' || typeof this.parent != 'function') { return null; }
    return this.parent().id;
  }

  get label() {
    if (this.type === 'busy' || typeof this.ownerDocument != 'function') { return this.title; }
    return this.ownerDocument().title;
  }

  get status() {
    if (this.type === 'busy' || typeof this.ownerDocument != 'function') { return 'busy'; }
    return this.ownerDocument().status;
  }
}

timeslotSchema.loadClass(Timeslot);
module.exports = model('Timeslot', timeslotSchema);