const _               = require('lodash');
const moment          = require('moment');
const { PaymentData } = require('../../config/data');
const { Billing }     = require('../../models');
const ScriptService   = require('../script');

module.exports = class CancelOverduePaymentsScriptService extends ScriptService {
  constructor() {
    super();

    this.billingsWithOverduePayments = [];
  }

  async runScript() {
    console.log('Internally running service');
    await this.searchOverduePayments();
    await this.updatePaymentStatus();
    this.sendOverdueWarningMail();

    return this;
  }

  async searchOverduePayments() {
    console.log('Searching for billings with overdue payments');
    this.billingsWithOverduePayments = await Billing.find({
      'payments.status': PaymentData.PAYMENT_STATUS_PENDING, 
      'payments.due_at': { $lte: moment().format('YYYY-MM-DD') }
    });

    console.log(`Found ${this.getNumOfOverduePayments()} overdue payments`);
    return this;
  }

  getNumOfOverduePayments() {
    return _.reduce(this.billingsWithOverduePayments, (total, billing) => {
      total += billing.payments.length;
      return total;
    }, 0);
  }

  async updatePaymentStatus() {
    _.forEach(this.billingsWithOverduePayments, async (billing) => {
      _.forEach(billing.payments, payment => {
        if (payment.status !== PaymentData.PAYMENT_STATUS_PENDING || moment(payment.due_at).diff(moment()) > 0) {
          return;
        }

        console.log(`Setting ${payment.id} of ${payment.amount} due ${moment(payment.due_at).format('YYYY-MM-DD')} as overdue`);
        payment.status        = PaymentData.PAYMENT_STATUS_OVERDUE;
        payment.failed_reason = PaymentData.PAYMENT_FAILED_REASON_OVERDUE;
      });

      await billing.save();
      console.log(`Billing ${billing.id} saved`);
    });

    console.log('Finished updating billings');
    return this;
  }

  async sendOverdueWarningMail() {
    return this;
  }
}