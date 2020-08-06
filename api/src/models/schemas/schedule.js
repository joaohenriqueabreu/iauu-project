// const db = require('../../data/db')
const db = require('mongoose')
const timeslotSchema = require('./timeslot')
const baseSchemaOptions = require('../schemas/options')

const scheduleSchema = new db.Schema({
  type: { type: String },
  timeslots: [timeslotSchema]    
}, baseSchemaOptions)

module.exports = scheduleSchema