require('../config/env');
const util = require('util');

module.exports = class Exception extends Error {
    constructor(message, error) {
        super(message);
        this.code = 500;
        this.message = message;

        // TODO Grab original error and send to sentry.io (in production or log in testing)
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Exception: ${util.inspect(error)}`);
        }
    }
}