const { Schema, model } = require('mongoose');
const baseSchemaOptions = require('./schemas/options');

const feedbackSchema = new Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    notes: { type: String },
    safe: { type: Boolean, default: true },
    from: {
      contractor_id: { type: String },
      name: { type: String },
      photo: { type: String },
    },
    artist_id: { type: String, required: true },
    presentation_id: { type: String, required: true }
}, baseSchemaOptions);

module.exports = model('Feedback', feedbackSchema);