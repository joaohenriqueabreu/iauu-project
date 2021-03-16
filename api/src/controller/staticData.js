'use strict';
const { BankAccountHelper }  = require('../utils');


const BaseController = require('./base');

class StaticDataController extends BaseController {
  async banks(req, res, next) {
    console.log("Requesting banks list...");
    const data = await BankAccountHelper.getInstitutionsList();
    
    res.status(200).json(data);
  }
}

module.exports = new StaticDataController();
