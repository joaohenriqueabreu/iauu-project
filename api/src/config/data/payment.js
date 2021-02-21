require("dotenv").config();

const GatewayAccount = require('../../models/schemas/gatewayAccount');

OUR_GATEWAY_ACCOUNT = new GatewayAccount({
  name: process.env.OUR_COMPANY_LEGAL_NAME,
  email: process.env.OUR_COMPANY_ADMIN_MAIL,
  document: process.env.OUR_COMPANY_DOCUMENT_NUM,
  account_id: process.env.OUR_COMPANY_GATEWAY_ACCOUNT_ID,
});

module.exports = {
  OUR_GATEWAY_ACCOUNT
}