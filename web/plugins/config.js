import config from '../static/data/config';

export default ({ app }, inject) => {
  inject('config', config)
}
