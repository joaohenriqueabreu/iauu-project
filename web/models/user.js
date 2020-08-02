import { Model } from 'vue-mc'
import Media from './media'

export default class User extends Model {
  defaults() {
    return {
      id: null,
      public_name: '',
      token: '',
      type: '',
      first_name: '',
      last_name: '',
      photo: new Media(),
      phone: '',
      password: '',
      email: '',
      requires_initial_setup: true
    }
  }
}
