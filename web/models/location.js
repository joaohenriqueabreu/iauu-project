import Model from './model'

const PLACES_MAPPING = {
  street_number: 'number',
  route: 'street',
  sublocality_level_1: 'neighboorhood',
  administrative_area_level_2: 'city',
  administrative_area_level_1: 'state',
  country: 'country',
  postal_code: 'zipcode'
}

const DONT_SHOW_PROPS = ['id', '_id', 'zipcode', 'address_complemet', 'coordinates', 'formatted']

export default class Location extends Model {
  constructor(locationData) {
    super()
    delete this.id
    this.street = ''
    this.street_complement = ''
    this.number = ''
    this.neighboorhood = ''
    this.city = ''
    this.state = ''
    this.country = ''
    this.zipcode = ''
    this.display = ''
    this.coordinates = {
      latitude: 0,
      longitude: 0
    }

    this.formatted = ''

    if (
      locationData !== undefined &&
      Object.prototype.hasOwnProperty.call(locationData, 'address_components')
    ) {
      this.assignFromGooglePlaces(locationData)
    } else {
      this.assign(locationData)
    }
  }

  assignFromGooglePlaces(locationData) {
    const self = this
    locationData.address_components.forEach((component) => {
      component.types.forEach((type) => {
        if (Object.prototype.hasOwnProperty.call(PLACES_MAPPING, type)) {
          self[PLACES_MAPPING[type]] = component.long_name
        }
      })
    })

    this.formatted = locationData.formatted_address
    self.coordinates.latitude = locationData.geometry.location.lat()
    self.coordinates.longitude = locationData.geometry.location.lng()
  }

  toString() {
    if (this.formatted.length > 0) {
      return this.formatted
    }

    const addressDisplay = []
    for (const prop in this) {
      if (!DONT_SHOW_PROPS.includes(prop) && this[prop].length > 0) {
        addressDisplay.push(this[prop])
      }
    }

    return addressDisplay.join(', ')
  }
}
