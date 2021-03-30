const authorizationMiddleware = require('./authorization');
const validationMiddleware = require('./validation');
const dataMiddleware = require('./data');
const errorMiddleware = require('./error');

module.exports = { authorizationMiddleware, validationMiddleware, dataMiddleware, errorMiddleware }