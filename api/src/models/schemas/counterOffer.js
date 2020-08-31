// const db = require('../../data/db')
const db = require('mongoose')
const baseSchemaOptions = require('../schemas/options')

const counterOfferSchema = new db.Schema({
    price: { type: Number },
    duration: { type: String },
    status: { type: String, enum: ['void', 'pending', 'accepted', 'rejected'], default: 'void'},
    notes: { type: String },
}, baseSchemaOptions)

module.exports = counterOfferSchema