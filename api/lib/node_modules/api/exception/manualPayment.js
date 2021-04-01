const Exception = require('./exception');

module.exports = class ManualPaymentRequiredException extends Exception { 
    constructor(message, error) {
        if (message === undefined) { message = 'Manual payment required.' }
        super(message, error);
    }
}