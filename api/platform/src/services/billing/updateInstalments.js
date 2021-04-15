const _ = require('lodash');
const SaveBillingService = require('./saveBilling');

module.exports = class UpdateInstalmentsService extends SaveBillingService {
  constructor(id) {
    super();

    this.id = id;
  }

  async update(instalments) {
    this.instalments = instalments;

    await this.searchBilling();
    this.ensureBillingWasFound()
      .updateInstalmentsNum()
      .populateInstalments();

    await this.saveBilling();
  }

  updateInstalmentsNum() {
    this.instalments = _.map(this.instalments, (instalment, index) => {
      instalment.num = index + 1;
      return instalment;
    });

    return this;
  }

  populateInstalments() {
    this.billing.instalments = this.instalments;
    return this;
  }
}