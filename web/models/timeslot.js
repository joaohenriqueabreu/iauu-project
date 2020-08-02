import Model from '@/models/model'

export default class Timeslot extends Model {
  constructor(timeslot) {
    super()
    this.start_dt = null
    this.end_dt = null
    this.type = null
    this.full_day = false
    this.frequency = null

    this.assign(timeslot)
  }
}
