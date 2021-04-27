const BaseSchemaOptions = require('./options');

const Address         = require('./address');
const Timeslot        = require('./timeslot');
const Product         = require('./product');
const CounterOffer    = require('./counterOffer');

const Payment         = require('./payment');
const Instalment      = require('./instalment');
const BankAccount     = require('./bankAccount');
const GatewayAccount  = require('./gatewayAccount');

module.exports = { 
  BaseSchemaOptions, 
  Address,
  Timeslot, 
  Product,
  Payment,
  Instalment,
  BankAccount,
  GatewayAccount,
  CounterOffer,
};