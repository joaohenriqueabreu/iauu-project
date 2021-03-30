const db = require('mongoose')

const baseSchemaOptions = require('../schemas/options')
const timeslotSchema = require('./timeslot').schema;
const productSchema = require('./product').schema;
const counterOfferSchema = require('./counterOffer').schema;

const proposalSchema = new db.Schema({
    title: { type: String },
    price: { type: Number, default: 0 },
    duration: { type: String },
    timeslots: [timeslotSchema],
    product: productSchema,
    notes: { type: String },
    counter_offer: counterOfferSchema
}, baseSchemaOptions);

module.exports = db.model('Proposal', proposalSchema);