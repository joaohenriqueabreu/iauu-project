
const BaseController = require('./base');
const { 
  SearchArtistAccountService, 
  SaveArtistAccountService, 
  SaveBillingService, 
  SearchPresentationBillingService, 
  PaymentService, 
  PayInstalmentService,
  UpdateInstalmentsService,
} = require('../services/billing');

class BillingController extends BaseController {
  async searchArtistAccount(req, res, next) {
    console.log('Searching artist account...');
    const searchArtistAccount = new SearchArtistAccountService();
    try {
      await searchArtistAccount
        .shouldNotFailIfNotFound()
        .search(req.user.role_id);

      res.status(200).json(searchArtistAccount.getAccount());
    } catch (error) {
      next(error);
    }
  }
  
  async saveBankAccount(req, res, next) {
    console.log('Saving bank account...');
    const saveArtistAccountSvc = new SaveArtistAccountService(req.user);
    try {
      await saveArtistAccountSvc.save(req.data.bankAccount);
      res.status(200).json(saveArtistAccountSvc.getAccount());
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

  async searchPresentationBilling(req, res, next) {
    console.log('Searching for billing...');
    const searchPresentationBillingSvc = new SearchPresentationBillingService();
    try {
      await searchPresentationBillingSvc.search(req.data.id);
      res.status(200).json(searchPresentationBillingSvc.getBilling());
    } catch (error) {
      next(error);
    }
  }

  async updateInstalments(req, res, next) {
    console.log('Updating instalments...');
    const updateInstalmentsSvc = new UpdateInstalmentsService(req.data.id);
    try {
      await updateInstalmentsSvc.update(req.data.instalments);
      res.status(200).json(updateInstalmentsSvc.getBilling());
    } catch (error) {
      next(error);
    }
  }

  async chargePayment(req, res, next) {
    console.log('Paying presentation...');
    
    const payBillingSvc = req.data.instalment !== undefined
      ? new PayInstalmentService(req.user, req.data.instalment, req.data.method, req.data.fee)
      : new PaymentService(req.user, req.data.id, req.data.method, req.data.fee);

    try {
      await payBillingSvc.pay();
      res.status(200).json({
        billing: payBillingSvc.getBilling(),
        payment: payBillingSvc.getPayment(),
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BillingController();
