const { BankAccountHelper, ReadStaticFileHelper }  = require('../services/utils');

const BaseController = require('./base');

class StaticDataController extends BaseController {
  async banks(req, res, next) {
    console.log('Requesting banks list...');
    const data = await BankAccountHelper.getInstitutionsList();
    
    res.status(200).json(data);
  }

  async categories(req, res, next) {
    console.log('Requesting categories list...');
    const data = await ReadStaticFileHelper.getFileContents('categories');
    
    res.status(200).json(data);
  }

  async presentations(req, res, next) {
    console.log('Requesting presentation types list...');
    const data = await ReadStaticFileHelper.getFileContents('presentations');
    
    res.status(200).json(data);
  }
}

module.exports = new StaticDataController();
