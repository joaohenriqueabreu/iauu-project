const parseLocation = (location) => {
  if (typeof location !== 'object' || !location.hasOwnProperty('latitude') || !location.hasOwnProperty('longitude')) {
    return null;
  }

  return {
    type: "Point",
    coordinates: [location.longitude, location.latitude]
  }
};

module.exports = { parseLocation }