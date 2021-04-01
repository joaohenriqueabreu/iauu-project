const BaseSchemaOptions = require('./options');

const Address = require('./address');
const Proposal = require('./proposal');
const Timeslot = require('./timeslot');
const Product = require('./product');

const Payment = require('./payment');
const Instalment = require('./instalment');
const BankAccount = require('./bankAccount');
const GatewayAccount = require('./gatewayAccount');

module.exports = { 
  BaseSchemaOptions, 
  Address, 
  Proposal, 
  Timeslot, 
  Product,
  Payment,
  Instalment,
  BankAccount,
  GatewayAccount
};