const { find }              = require('lodash');
const ReadStaticFileHelper  = require('./readStaticFile');

const getInstitutionsList = async () => {
  const banks = await ReadStaticFileHelper.getFileContents('banks');
  return banks;
}

const getInstitutionData = async (code) => {
  const banks = await getInstitutionsList();
  const data = find(banks, (bank) => bank.code === code);

  return data;
}

module.exports = { getInstitutionsList, getInstitutionData }