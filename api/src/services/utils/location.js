const parseLocation = (location) => {
  if (typeof location !== 'object' || location === null || location === undefined || !location.hasOwnProperty('latitude') || !location.hasOwnProperty('longitude')) {
    return null;
  }

  return {
    type: 'Point',
    coordinates: [location.longitude, location.latitude]
  }
};

module.exports = { parseLocation }