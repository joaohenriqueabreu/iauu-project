const NodeCache = require('node-cache');

const options = {
  stdTTL: 60 * 60 * 24 *30
}

const cache = new NodeCache(options);
module.exports = cache;
