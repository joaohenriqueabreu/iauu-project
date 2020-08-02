import pluralize from 'pluralize'
import { Model } from 'vue-mc'

const utils = {
  pluralize: (value, count) => pluralize(value, count),
  genCalendarEventId: (timeslot) => `${timeslot.type}_${timeslot.id}`,

  empty: (variable) => {
    if (variable === undefined || variable === null) {
      return true
    }

    if (variable instanceof Model) {
      return variable.id === 0 || variable.id === null
    }

    if (typeof variable === 'number') {
      return variable === 0
    }

    if (typeof variable === 'boolean') {
      return !variable
    }

    if (Array.isArray(variable) || typeof variable === 'string') {
      return variable.length === 0
    }

    if (typeof variable === 'object') {
      for (const key in variable) {
        if (Object.prototype.hasOwnProperty.call(variable, key)) return false
      }

      return true
    }

    return false
  },
  isMobile: () =>  {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true
    } else {
      return false
    }
  }, 
  delay: () => {
    return setTimeout(() => {}, 5000)
  }
}

export default ({ app }, inject) => {
  // We use empty a lot, so inject it separately too
  inject('empty', utils.empty)
  inject('mobile', utils.isMobile)
  inject('utils', utils)
}
