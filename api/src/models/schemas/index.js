const BaseSchemaOptions = require('./options');

const Address = require('./address');
const Proposal = require('./proposal');
const Timeslot = require('./timeslot');
const Product = require('./product');

const Billing = require('./billing');
const Payment = require('./payment');
const BankAccount = require('./bankAccount');
const GatewayAccount = require('./gatewayAccount');

module.exports = { 
  BaseSchemaOptions, 
  Address, 
  Proposal, 
  Timeslot, 
  Product, 
  Billing, 
  Payment,
  BankAccount,
  GatewayAccount
};