const Exception = require('./exception');

module.exports = class InvalidPaymentMethodProvidedException extends Exception { 
    constructor(message) {
        super(message || 'Invalid Payment Method provided');
        this.code = 500;
    }
}