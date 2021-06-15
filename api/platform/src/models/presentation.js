const config                            = require('iauu/env');
const { Schema, model }                 = require('mongoose');
const moment                            = require('moment');
const BaseRepository                    = require('./repositories/base');
const baseSchemaOptions                 = require('./schemas/options');
const { PresentationData, BillingData } = require('../config/data');

const addressSchema                     = require('./schemas/address').schema;
const timeslotSchema                    = require('./schemas/timeslot').schema;
const documentSchema                    = require('./schemas/document').schema;

const defaultFee                        = config.payment.ourFee || 0.12;

const presentationSchema = new Schema({
  contractor:     { type: Schema.Types.ObjectId, ref: 'Contractor' },
  artist:         { type: Schema.Types.ObjectId, ref: 'Artist' },
  artist_id:      { type: String, required: true },
  contractor_id:  { type: String, required: true },
  proposal_id:    { type: String, required: true },
  billing_id:     { type: String },
  title:          { type: String, required: true },
  fee:            { type: Number, required: true, default: defaultFee, max: 1 },
  duration:       { type: String, required: true },
  price:          { type: Number, required: true },
  address:        { type: addressSchema },
  status:         { type: String, enum: PresentationData.PRESENTATION_STATUS, required: true, default: PresentationData.PRESENTATION_STATUS_ACCEPTED },
  confirm_status: [String],
  timeslot:       { type: timeslotSchema, required: true },
  checklist: [{
    name:         { type: String },
    completed:    { type: String },
    completed_at: { type: Date },
  }],
  documents:      [{ type: documentSchema, default: [] }],
}, { ...baseSchemaOptions })

class Presentation extends BaseRepository {
  get is_rejected()   { return this.status === PresentationData.PRESENTATION_STATUS_REJECTED; }
  get is_contracted() { return this.status === PresentationData.PRESENTATION_STATUS_ACCEPTED; }  
  get is_completed()  { return this.status === PresentationData.PRESENTATION_STATUS_COMPLETED; }
  get is_cancelled()  { return this.status === PresentationData.PRESENTATION_STATUS_CANCELLED; }
  get is_paid()       { return this.is_completed && this.billing !== undefined && this.billing.status === BillingData.COMPLETED_STATUS; }

  get display_start_dt() { return this.timeslot.start_dt; }
  get display_end_dt()   { return this.timeslot.end_dt; }

  get is_presentation_close() {
    if (this.status === PresentationData.PRESENTATION_STATUS_PROPOSAL) { return false; }
    const from = moment().subtract(7, 'days');
    const today = moment();
    const date = moment(this.timeslot.start_dt);
    return date.isBetween(from, date);
  }

  get is_presentation_today() {
    if (this.status === PresentationData.PRESENTATION_STATUS_PROPOSAL) { return false; }
    return moment(this.timeslot.start_dt).isSame(moment(), 'day');
  }

  get is_presentation_past() {
    if (this.status === PresentationData.PRESENTATION_STATUS_PROPOSAL) { return false; }
    const today = moment();
    const date = moment(this.timeslot.start_dt);
    return today.diff(date, 'days') > 0;
  }

  get is_confirmed()  { 
    return this.is_completed || (this.was_confirmed_by_contractor && this.was_confirmed_by_artist);
  }

  get was_confirmed_by_contractor() {
    return this.is_completed || (this.is_contracted && this.confirm_status.includes('contractor'));
  }

  get was_confirmed_by_artist() {
    return this.is_completed || (this.is_contracted && this.confirm_status.includes('artist'));
  }
}

presentationSchema.loadClass(Presentation);
module.exports = model('Presentation', presentationSchema);
