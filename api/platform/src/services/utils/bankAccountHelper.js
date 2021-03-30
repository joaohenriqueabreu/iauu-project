const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const getInstitutionsList = async () => {
  const banks = await JSON.parse(fs.readFileSync(path.join(__dirname, '../../config/banks.json'), 'utf8'));
  return banks;
}

const getInstitutionData = async (code) => {
  const banks = await getInstitutionsList();
  const data = _.find(banks, (bank) => bank.code === code);

  return data;
}

module.exports = { getInstitutionsList, getInstitutionData }