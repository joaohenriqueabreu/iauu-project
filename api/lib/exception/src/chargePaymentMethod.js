const Exception = require('./exception');

module.exports = class FailedChargingPaymentMethodException extends Exception { 
    constructor(message, error) {
        super(message, error);
        this.code = 500;
    }
}