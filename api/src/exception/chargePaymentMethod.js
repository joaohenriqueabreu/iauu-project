const Exception = require('./exception');

module.exports = class FailedChargingPaymentMethodException extends Exception { 
    constructor(message) {
        super(message);
        this.code = 500;
    }
}