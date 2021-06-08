const authorizationMiddleware = require('./authorization');
const validationMiddleware    = require('./validation');
const errorMiddleware         = require('./error');
const loggerMiddleware        = require('./logger');

module.exports = { authorizationMiddleware, validationMiddleware, errorMiddleware, loggerMiddleware }