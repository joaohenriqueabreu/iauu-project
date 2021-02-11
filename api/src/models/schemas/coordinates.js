const db = require('mongoose');
const BaseModel = require('../base');

const coordinatesSchema = new db.Schema({
  type: { type: String },
  coordinates: { type: [Number] }
});

class Coordinates extends BaseModel {
  constructor(latitude, longitude) {
    super();

    this.type = "Point";
    this.coordinates = [longitude, latitude];
  }
}

coordinatesSchema.loadClass(Coordinates);
module.exports = coordinatesSchema;
