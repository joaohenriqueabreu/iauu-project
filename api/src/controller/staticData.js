'use strict';
const fs = require('fs');
const path = require('path');

const BaseController = require('./base');

class StaticDataController extends BaseController {
  async banks(req, res, next) {
    console.log("Requesting banks list...");
    const data = {}
    data.banks = await JSON.parse(fs.readFileSync(path.join(__dirname, '../config/banks.json'), 'utf8'));
    res.status(200).json(data.banks);
  }
}

module.exports = new StaticDataController();
