const { Schema, model } = require('mongoose');
const baseSchemaOptions = require('../schemas/options');

const counterOfferSchema = new Schema({
    price:      { type: Number },
    duration:   { type: Number },
    status:     { type: String, enum: ['void', 'pending', 'accepted', 'rejected'], default: 'void'},
    notes:      { type: String },
}, baseSchemaOptions);
 
module.exports = model('CounterOffer', counterOfferSchema);