const BaseRepository = require('../repositories/base');

class Location extends BaseRepository {
  constructor(data) {
    super(data);

    if (data.location !== undefined) {
      this.convertGeoData(data.location);
    }
  }

  convertGeoData(locationData) {
    this.location = {
      type: 'Point',
      coordinates: [locationData.longitude, locationData.latitude]
    }
  }    
}

module.exports = Location;