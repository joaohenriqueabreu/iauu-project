const config = require('../env');
const util = require('util');

module.exports = class Exception extends Error {
    constructor(message, error, code) {
        super(message);
        this.code = code || 500;
        this.message = message;

        // TODO Grab original error and send to sentry.io (in production or log in testing)
        if (config.isProductionEnv()) {
            console.log(error !== undefined ? `Exception: ${util.inspect(error)}` : `Exception: ${message}`);
        }
    }
}