// @index('./*.js', (f, _) => `const ${_.pascalCase(f.name)}Service = require('${f.path}');`)
const BaseService = require('./base');
const GetMessageHistoryService = require('./getMessageHistory');
const SaveMessageService = require('./saveMessage');
//@endindex

module.exports = {
  // @index('./*.js', (f, _) => `${_.pascalCase(f.name)}Service,`)
  BaseService,
  GetMessageHistoryService,
  SaveMessageService,
  //@endindex
}