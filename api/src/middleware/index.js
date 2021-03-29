const authorizationMiddleware = require('../middleware/authorization');
const validationMiddleware = require('../middleware/validation');
const dataMiddleware = require('./data');

module.exports = {
  authorizationMiddleware, validationMiddleware, dataMiddleware
}