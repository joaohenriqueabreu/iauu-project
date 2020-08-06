require('dotenv').config()
const db = require('../data/db')
const BaseModel = require('./base')
const baseSchemaOptions = require('./schemas/options')

const proposalSchema = require('./schemas/proposal')
const addressSchema = require('./schemas/address')
const timeslotSchema = require('./schemas/timeslot')

const { Schema } = db

const defaultFee = process.env.PLATAFORM_FEE || 0.12

const slugfy = function (slug) {
  return this.company_name !== undefined 
    ? this.company_name.toLowerCase().replace(' ', '-')
    : this.user.name.toLowerCase().replace(' ', '-')
}

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
  duration: { type: Number }
}, { ...baseSchemaOptions })

class Presentation extends BaseModel {
  constructor() {
    super()
  }

  get current_price() {
    if (this.status === 'proposal') {
      if (this.proposal.custom) {
        if (this.proposal.counterOffer !== undefined) {}
      }
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
