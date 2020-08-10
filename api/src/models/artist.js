require('dotenv').config()
// const db = require('../data/db')
const db = require('mongoose')
const _ = require('lodash')
const BaseModel = require('./base')
const baseSchemaOptions = require('./schemas/options')
const { v4: uid } = require('uuid');

const addressSchema = require('./schemas/address')
const socialSchema = require('./schemas/media')
const productsSchema = require('./schemas/product')
const timeslotSchema = require('./schemas/timeslot')
const feedbackSchema = require('./schemas/feedback')

const { Schema } = db

const artistSchema = new Schema({
  users : [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  name: { type: String },
  photo: { type: String },
  slug: { 
    type: String,
    default: uid()
  },
  document: { type: String },
  phone: { type: String },
  story: { type: String },
  media: {
    bg: { type: String },
    presentations: [String]
  },
  category: {
    name: { type: String },
    subcategories: [String]
  },

  products: [productsSchema],
  schedule: [timeslotSchema],

  tags: [String],
  social: [socialSchema],
  address: addressSchema,
  rating: { type: Number },
  feedbacks: [feedbackSchema]
}, { ...baseSchemaOptions })

class Artist extends BaseModel {
  constructor() {
    super()
  }

  get feedback_count() {
    if (this.feedbacks === undefined) {
      return 0
    }

    return this.feedbacks.length
  }
}

artistSchema.index({ name: 'text', story: 'text', 'category.name': 'text', 'category.subcategory': 'text', tags: 'text' })
artistSchema.loadClass(Artist)
module.exports = db.model('Artist', artistSchema)
