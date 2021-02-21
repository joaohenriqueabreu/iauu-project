require('dotenv').config();

const db = require('mongoose');
const BaseRepository = require('./repositories/base');
const baseSchemaOptions = require('./schemas/options');

const proposalSchema = require('./schemas/proposal').schema;
const addressSchema = require('./schemas/address').schema;
const timeslotSchema = require('./schemas/timeslot').schema;
const invoiceSchema = require('./schemas/invoice').schema;

const { Schema } = db;

const defaultFee = process.env.PLATAFORM_FEE || 0.12;

const presentationSchema = new Schema({
  contractor: {
    type: Schema.Types.ObjectId,
    ref: 'Contractor'
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'Artist'
  },
  fee: { type: Number, required: true, default: defaultFee, max: 1 },
  address: addressSchema,

  /**
   * Proposal   - Proposal stage
   * Accepted   - Proposal accepted (pré-presentation)
   * Completed  - Presentation completed
   * Rejected   - Proposal rejected
   * Cancelled  - Presentation cancelled
   * Disputed   - Presentation disputed
   */

  status: { type: String, enum: ['proposal', 'accepted', 'completed', 'rejected', 'cancelled', 'disputed'], required: true, default: 'proposal' },
  confirm_status: [String],
  timeslot: timeslotSchema,
  proposal: proposalSchema,
  invoice: invoiceSchema,
  price: { type: Number },
  duration: { type: String }
}, { ...baseSchemaOptions })

class Presentation extends BaseRepository {
  get current_price() {
    if (this.status === 'proposal') {
      if (this.proposal.counter_offer !== undefined) {
        return this.proposal.counter_offer.price;
      }

      return this.proposal.product.price;
    }

    return this.price;
  }

  get current_duration() {
    if (this.status === 'proposal') {

    }

    return this.price;
  }

  isCompleted() {
    return this.status === 'completed';
  }
}

presentationSchema.loadClass(Presentation);
module.exports = db.model('Presentation', presentationSchema);
