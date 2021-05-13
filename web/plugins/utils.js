import plural   from 'pluralize-ptbr';
import Model    from '../models/model';
import Product  from '../models/product';

const utils = {
  pluralize: (value, count) => {
    return plural(value, count);
  },
  genCalendarEventId: (timeslot) => `${timeslot.type}_${timeslot.id}`,

  empty: (variable) => {
    if (variable === undefined || variable === null) {
      return true;
    }

    // custom products don't have an id (not ideal to be here - needs to be generic) TODO move to other place
    if (variable instanceof Model && !variable instanceof Product) {
      return variable.id == 0 || variable.id == null;
    }

    if (typeof variable === 'number') {
      return variable === 0;
    }

    if (typeof variable === 'boolean') {
      return !variable;
    }

    if (Array.isArray(variable)) {
      return variable.length === 0;
    }

    if (typeof variable === 'string') {
      return variable === '';
    }

    if (typeof variable === 'object') {
      for (const key in variable) {
        if (Object.prototype.hasOwnProperty.call(variable, key)) return false;
      }

      return true;
    }

    return false;
  },
  clearFormat: (str) => {
    if (str == null) { return str; }
    return str.replace(/[^a-zA-Z0-9]/g, '');
  },
  isMobile: () => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ) {
      return true;
    } else {
      return false;
    }
  },
  delay: () => {
    return setTimeout(() => {}, 5000);
  },
  genAbsoluteUrl: (relativeUrl) => {
    const url = window.location;
    return `${url.protocol}//${url.host}${relativeUrl}`;
  }
}

export default ({ app }, inject) => {
  // We use empty a lot, so inject it separately too
  inject('empty',   utils.empty);
  inject('mobile',  utils.isMobile);
  inject('utils',   utils);
}
