const { Schema, model } = require('mongoose');
const { BaseRepository } = require('../repositories');
const baseSchemaOptions = require('../schemas/options');

const counterOfferSchema = new Schema({
    price:      { type: Number, required: true},
    duration:   { type: Number, required: true},
    status:     { type: String, enum: ['void', 'pending', 'accepted', 'rejected'], default: 'void'},
    notes:      { type: String},
}, baseSchemaOptions);

class CounterOffer extends BaseRepository { }

counterOfferSchema.loadClass(CounterOffer);
module.exports = model('CounterOffer', counterOfferSchema);