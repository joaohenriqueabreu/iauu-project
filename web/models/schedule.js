import Model from './model'

export default class Schedule extends Model {
  defaults() {
    return {
      id: null,
      timeslots: []
    }
  }
}
