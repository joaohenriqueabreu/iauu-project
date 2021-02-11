const formatAddressData = (data) => {
// TODO check that data has the correct location format
  return {
    ...data,
    location: {
      type: "Point",
      coordinates: [data.location.longitude, data.location.latitude]
    }
  }
}

module.exports = { formatAddressData };