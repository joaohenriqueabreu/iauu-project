const config = require('../env');
const { Schema, model }  = require('mongoose');
const moment = require('moment');
const BaseRepository = require('./repositories/base');
const baseSchemaOptions = require('./schemas/options');
const { PresentationData, InvoiceData } = require('../config/data');

const proposalSchema = require('./schemas/proposal').schema;
const addressSchema = require('./schemas/address').schema;
const timeslotSchema = require('./schemas/timeslot').schema;
const invoiceSchema = require('./schemas/invoice').schema;

const defaultFee = config.payment.ourFee || 0.12;

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

  status: { type: String, enum: PresentationData.PRESENTATION_STATUS, required: true, default: PresentationData.PRESENTATION_STATUS_PROPOSAL },
  confirm_status: [String],
  timeslot: timeslotSchema,
  proposal: proposalSchema,
  invoice: invoiceSchema,
  price: { type: Number },
  duration: { type: String }
}, { ...baseSchemaOptions })

class Presentation extends BaseRepository {
  get current_price() {
    if (this.status === PresentationData.PRESENTATION_STATUS_PROPOSAL) {
      if (this.proposal.counter_offer !== undefined) {
        return this.proposal.counter_offer.price;
      }

      return this.proposal.product.price;
    }

    return this.price;
  }

  get current_duration() {
    if (this.status === PresentationData.PRESENTATION_STATUS_PROPOSAL) {

    }

    return this.price;
  }

  get is_completed() {
    return this.status === PresentationData.PRESENTATION_STATUS_COMPLETED;
  }

  get is_paid() {
    return this.is_completed && this.invoice !== undefined && this.invoice.status === InvoiceData.COMPLETED_STATUS;
  }

  get display_start_dt() {
    if (this.status === PresentationData.PRESENTATION_STATUS_PROPOSAL) {
      return this.proposal.timeslots[0].start_dt;
    }

    return this.timeslot.start_dt;
  }

  get display_end_dt() {
    if (this.status === PresentationData.PRESENTATION_STATUS_PROPOSAL) {
      return this.proposal.timeslots[0].end_dt;
    }

    return this.timeslot.end_dt;
  }

  get is_contracted() {
    return this.status === PresentationData.PRESENTATION_STATUS_ACCEPTED;
  }

  get is_presentation_close() {
    const from = moment().subtract(7, 'days');
    const to = moment();
    const date = moment(this.timeslot.start_dt);
    return date.isBetween(from, to);
  }

  get is_presentation_today() {
    const date = moment(this.timeslot.start_dt);
    return date.isSame(moment(), 'day');
  }

  get is_presentation_past() {
    const tomorrow = moment().add(1, 'days');
    const date = moment(this.timeslot.start_dt);
    return date.diff(tomorrow) > 0;
  }
}

presentationSchema.loadClass(Presentation);
module.exports = model('Presentation', presentationSchema);
