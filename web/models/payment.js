import { Model } from 'vue-mc'
import Presentation from '@/models/presentation'

export default class Payment extends Model {
  defaults() {
    return {
      id: null,
      status: '',
      amount: 0,
      paid: 0,
      create_dt: '',
      presentation: new Presentation()
    }
  }
}
