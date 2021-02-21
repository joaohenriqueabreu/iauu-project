const db = require('mongoose');
const BaseRepository = require('../repositories/base');
const Coordinates = require('./coordinates');
const baseSchemaOptions = require('../schemas/options');

const addressSchema = new db.Schema({
    street: {type: String},
    number: {type: String},
    neighboorhood: {type: String},
    city: {type: String},
    state: {type: String},
    country: {type: String},
    zipcode: {type: String},
    location: { type: Coordinates }, 
}, baseSchemaOptions);

const SHOW_PROPS = ['street', 'number', 'neighboorhood', 'city', 'state', 'country']
class Address extends BaseRepository {
  constructor() {
    super();
  }

  get display() {
    const addressDisplay = []
    for (const prop in this) {
      if (SHOW_PROPS.includes(prop) && this[prop] !== undefined && this[prop] !==null && this[prop].length > 0) {
        addressDisplay.push(this[prop]);
      }
    }

    return addressDisplay.join(', ');
  }
}

addressSchema.index({ location: "2dsphere"});
addressSchema.loadClass(Address);
module.exports = db.model('Address', addressSchema);