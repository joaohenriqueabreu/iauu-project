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

const SHOW_PROPS = ['street', 'number', 'neighboorhood', 'city', 'state', 'country'];
const STATE_SHORTNAME_MAP = {
  'Acre': 'AC',
  'Alagoas': 'AL',
  'Amapá': 'AP',
  'Amazonas': 'AM',
  'Bahia': 'BA',
  'Ceará': 'CE',
  'Distrito Federal': 'DF',
  'Espirito Santo': 'ES',
  'Goiás': 'GO',
  'Maranhão': 'MA',
  'Mato Grosso': 'MT',
  'Mato Grosso do Sul': 'MS',
  'Minas Gerais': 'MG',
  'Pará': 'PA',
  'Paraíba': 'PB',
  'Paraná': 'PR',
  'Pernambuco': 'PE',
  'Piauí': 'PI',
  'Roraima': 'RR',
  'Rondônia': 'RO',
  'Rio de Janeiro': 'RJ',
  'Rio Grande do Norte': 'RN',
  'Rio Grande do Sul': 'RS',
  'Santa Catarina': 'SC',
  'São Paulo': 'SP',
  'Sergipe': 'SE',
  'Tocantins': 'TO',
};

class Address extends BaseRepository {
  constructor() {
    super();
  }

  get display() {
    const addressDisplay = []
    for (let prop in this) {
      if (SHOW_PROPS.includes(prop) && this[prop] !== undefined && this[prop] !==null && this[prop].length > 0) {
        if (prop === 'state' && this.in_brasil) { prop = 'short_state'; }

        addressDisplay.push(this[prop]);
      }
    }

    return addressDisplay.join(', ');
  }

  get in_brasil() {
    return this.country === 'Brasil';
  }

  get short_display() {
    return this.city + ', ' + this.short_state;
  }

  get short_state() {
    return this.state.length > 2 ? STATE_SHORTNAME_MAP[this.state] : this.state;
  }
}

addressSchema.index({ location: '2dsphere'});
addressSchema.loadClass(Address);
module.exports = db.model('Address', addressSchema);