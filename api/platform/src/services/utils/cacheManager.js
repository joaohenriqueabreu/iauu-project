const BaseService = require('../base');
const cache = require('@iauu/cache');

module.exports = class CacheManagerService extends BaseService {
  constructor(user, key) {
    super();

    if (user == undefined || user === null || key === undefined || key === null) {
      throw new Error('User nor Cache key can be empty');
    }

    this.user = user;
    this.key = key;
  }

  getKey() {
    return `${this.key}.${this.user.id}`;
  }

  hasCacheRecord() {
    return cache.has(this.getKey());
  }

  retrieve() {
    return cache.get(this.getKey());
  }

  store(value) {
    cache.set(this.getKey(), value);
    return this;
  }
}