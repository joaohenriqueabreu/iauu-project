import { Model } from 'vue-mc'

export default class Schedule extends Model {
  defaults() {
    return {
      id: null,
      timeslots: []
    }
  }
}
