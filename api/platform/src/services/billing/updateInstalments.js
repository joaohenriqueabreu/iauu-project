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
      .populateInstalments();

    await this.saveBilling();
  }

  populateInstalments() {
    this.billing.instalments = this.instalments;
    return this;
  }
}