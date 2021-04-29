const authorizationMiddleware = require('./authorization');
const validationMiddleware    = require('./validation');
const errorMiddleware         = require('./error');

module.exports = { authorizationMiddleware, validationMiddleware, errorMiddleware }