require('dotenv').config()
// const db = require('../data/db')
const db = require('mongoose')
const BaseModel = require('./base')
const baseSchemaOptions = require('./schemas/options')

const proposalSchema = require('./schemas/proposal')
const addressSchema = require('./schemas/address')
const timeslotSchema = require('./schemas/timeslot')

const { Schema } = db

const defaultFee = process.env.PLATAFORM_FEE || 0.12

const presentationSchema = new Schema({  
  contractor: {
    type: Schema.Types.ObjectId,
    ref: 'Contractor'
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'Artist'
  },
  fee: { type: Number, required: true, default: defaultFee },
  address: addressSchema,

  /**
   * Proposal   - Proposal stage
   * Accepted   - Proposal accepted (pré-presentation)
   * Completed  - Presentation completed
   * Rejected   - Proposal rejected
   * Cancelled  - Presentation cancelled
   * Disputed   - Presentation disputed
   */

  status: { type: String, enum: ['proposal', 'accepted', 'completed', 'rejected', 'cancelled', 'disputed'], required: true },
  confirm_status: [String],
  timeslot: timeslotSchema,
  proposal: proposalSchema,
  price: { type: Number },
  duration: { type: String }
}, { ...baseSchemaOptions })

class Presentation extends BaseModel {
  constructor() {
    super()
  }

  get current_price() {
    if (this.status === 'proposal') {
      if (this.proposal.counter_offer !== undefined) {
        return this.proposal.counter_offer.price
      }

      return this.proposal.product.price
    }

    return this.price
  }

  get current_duration() {
    if (this.status === 'proposal') {

    }

    return this.price
  }
}

presentationSchema.loadClass(Presentation)
module.exports = db.model('Presentation', presentationSchema)
