const _ = require('lodash')
// const db = require('../../data/db')
const db = require('mongoose')
const BaseModel = require('../base')
const baseSchemaOptions = require('../schemas/options')

const timeslotSchema = new db.Schema({
  title: { type: String },
  description: { type: String },
  start_dt: { type: Date },
  end_dt: { type: Date },
  full_day: { type: Boolean },
  type: { type: String, enum: ['event', 'busy']},
  repeat: { type: String, enum: ['day', 'week', 'month', 'year']},
}, baseSchemaOptions)

class Timeslot extends BaseModel {
  constructor() {
    super()
  }

  get presentation_id() {
    if (this.type === 'busy') {
      return null
    }

    return this.ownerDocument().id
  }

  get artist_id() {
    if (this.type === 'event') {
      return null
    }

    return this.parent().id
  }

  get label() {
    if (this.type === 'busy') {
      return this.title
    }

    return this.ownerDocument().proposal.title
  }

  get status() {
    if (this.type === 'busy') {
      return 'busy'
    }

    return this.ownerDocument().status
  }
}

timeslotSchema.loadClass(Timeslot)
module.exports = timeslotSchema