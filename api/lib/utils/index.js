const isEmpty = function (value) {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === 'number') {
    return value === 0;
  }

  if (typeof value === 'boolean') {
    return !value;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'string') {
    return value === '';
  }

  if (typeof value === 'object') {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) return false;
    }

    return true;
  }

  return false;
}

module.exports = {
  isEmpty,
}