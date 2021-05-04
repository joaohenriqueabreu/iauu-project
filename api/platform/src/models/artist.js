const { Schema, model } = require('mongoose');
const _                 = require('lodash');

const BaseRepository    = require('./repositories/base');
const baseSchemaOptions = require('./schemas/options');
const { v4: uid }       = require('uuid');

const addressSchema     = require('./schemas/address').schema;
const productsSchema    = require('./schemas/product').schema;
const timeslotSchema    = require('./schemas/timeslot').schema;

const artistSchema = new Schema({
  users : [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  name:     { type: String },
  email:    { type: String },
  photo:    { type: String },
  public:   { type: Boolean, default: true },
  slug: { 
    type: String,
    default: uid()
  },
  document: { type: String },
  phone:    { type: String },
  story:    { type: String },
  media:    {
    bg: { type: String },
    presentations: [String]
  },
  category: {
    name: { type: String },
    subcategories: [String]
  },
  presentation: {
    description:  { type: String },
    playlist:     { type: String },
    videos:       [String],
    gallery:      [String]
  },
  event_types:  [String],
  video:        { type: String },
  background:   { type: String },
  proposal: {
    display_products: { type: Boolean, default: false },
    display_price:    { type: Boolean, default: false },
    avg_price:        { type: Number, default: 0 },
    avg_duration:     { type: String, default: '01:00' },
    price_range:      { type: Number, min: 1, max: 5, default: 1 },
  },

  products: [productsSchema],
  schedule: [timeslotSchema],
  social: [String],
  stats: {
    followers:      { type: Number, default: 0 },
    presentations:  { type: Number, default: 0 },
    score:          { type: Number, default: 0 },
    visits: {
      period: { type: Date },
      amount: { type: Number, default: 0 }
    }
  },
  address: addressSchema,
  rating: { type: Number },
  has_closed_first_presentation: { type: Boolean, default: false }
}, { ...baseSchemaOptions });

class Artist extends BaseRepository {
  get feedback_count() {
    if (this.feedbacks == null) { return 0; }
    return this.feedbacks.length;
  }

  get manager() {
    return this.users[0];
  }

  get product_items() {
    return _.uniq(_.flatten(_.map(this.products, 'items')));
  }
}

artistSchema.loadClass(Artist);
artistSchema.index({ 
    'name':                     'text', 
    'story':                    'text', 
    'category.name':            'text', 
    'category.subcategory':     'text', 
    'event_types':              'text', 
    'tags':                     'text', 
    'presentation.description': 'text',
    'product.name':             'text', 
    'product.description':      'text', 
    'product.item':             'text' 
  },
  { name: 'artist-full-text-search' }
);

module.exports = model('Artist', artistSchema);
