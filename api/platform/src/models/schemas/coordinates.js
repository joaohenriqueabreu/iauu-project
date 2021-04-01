const db = require('mongoose');
const BaseRepository = require('../repositories/base');

const coordinatesSchema = new db.Schema({
  type: { type: String },
  coordinates: { type: [Number] }
});

class Coordinates extends BaseRepository {
  constructor(latitude, longitude) {
    super();

    this.type = 'Point';
    this.coordinates = [longitude, latitude];
  }
}

coordinatesSchema.loadClass(Coordinates);
module.exports = coordinatesSchema;
