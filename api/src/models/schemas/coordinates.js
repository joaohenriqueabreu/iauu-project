// const db = require('../../data/db')
const db = require('mongoose')

const coordinatesSchema = new db.Schema({
  type: { type: String },
  coordinates: { type: [Number] }
});

module.exports = coordinatesSchema;
