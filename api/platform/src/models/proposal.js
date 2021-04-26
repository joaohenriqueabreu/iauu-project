const { Schema, model }       = require('mongoose');

const BaseRepository          = require('./repositories/base');
const baseSchemaOptions 	    = require('./schemas/options');
const addressSchema 			    = require('./schemas/address').schema;
const timeslotSchema 			    = require('./schemas/timeslot').schema;
const productSchema      	    = require('./schemas/product').schema;
const counterOfferSchema 	    = require('./schemas/counterOffer').schema;

const RequestEndpointService  = require('lib/services/request');
const requestEndpointSvc      = new RequestEndpointService();

const proposalSchema = new Schema({
		artist_id: 			          { type: String, required: true },
		contractor_id:	          { type: String, required: true },
    title: 					          { type: String, required: true },
    status:                   { type: String, enum: ['proposal', 'accepted', 'rejected'] }, // TODO move to data consts
    price: 					          { type: Number, default: 0 },
    duration: 			          { type: Number, default: 0 },
    selected_timeslot:        { type: timeslotSchema },
    timeslots: 			          { type: [timeslotSchema], validate: timeslots => Array.isArray(timeslots) && timeslots.length > 0 },
    product: 				          { type: productSchema, required: true },
    address: 				          { type: addressSchema, required: true },
    notes: 					          { type: String },
    counter_offer: 	          { type: counterOfferSchema },
    rejected_counter_offers:  { type: [counterOfferSchema] },
}, baseSchemaOptions);

class Proposal extends BaseRepository {
	get current_price() {
    if (this.counter_offer != null) { return this.counter_offer.price; }
		if (this.product != null) 			{ return this.product.price; }

		return this.price;
  }

  get is_open() {
    return this.status === 'proposal'; // TODO change to open or pending
  }

  get is_rejected() {
    return this.status === 'rejected';
  }

  get has_selected_timeslot() {
    return this.selected_timeslot != null;
  }
}

proposalSchema.loadClass(Proposal);
module.exports = model('Proposal', proposalSchema);