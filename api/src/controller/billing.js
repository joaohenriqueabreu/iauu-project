
const BaseController = require('./base');
const SaveArtistAccountService = require('../services/billing/saveArtistAccount');
const SaveBillingService = require('../services/billing/saveBilling');

class BillingController extends BaseController {
  async saveBankAccount(req, res, next) {
    console.log('Saving bank account...');
    const saveArtistAccountSvc = new SaveArtistAccountService(req.user);
    try {
      await saveArtistAccountSvc.save(req.data.bankAccount);
      res.status(200).json(saveArtistAccountSvc.getArtist());
    } catch (error) {
      next(error);
    }
  }

  async createBilling(req, res, next) {
    console.log('Creating presentation billing...');
    const saveBillingSvc = new SaveBillingService();
    try {
      await saveBillingSvc.save(req.data);
      res.status(200).json(saveBillingSvc.getBilling());
    } catch (error) {
      next(error);
    }
  }

  async updateInstallments(req, res, next) {

  }

  async chargePayment(req, res, next) {

  }
}

module.exports = new BillingController();
