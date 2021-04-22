const BaseFactory           = require('./base');
const AuthUserFactory       = require('./auth');
const AddressFactory        = require('./address');
const TimeslotFactory       = require('./timeslot');
const BankAccountFactory    = require('./bankAccount');
const GatewayAccountFactory = require('./gatewayAccount');
const ProductFactory        = require('./product');
const UserFactory           = require('./user');
const ArtistFactory         = require('./artist');
const ContractorFactory     = require('./contractor');
const ProposalFactory       = require('./proposal');
const CounterOfferFactory   = require('./counterOffer');
const PresentationFactory   = require('./presentation');
const PaymentFactory        = require('./payment');
const PaymentMethodFactory  = require('./paymentMethod');

module.exports = {
  BaseFactory,
  AuthUserFactory,
  AddressFactory,
  TimeslotFactory,
  BankAccountFactory,
  GatewayAccountFactory,
  ProductFactory,
  CounterOfferFactory,
  UserFactory,
  ArtistFactory,
  ContractorFactory,
  ProposalFactory,
  PresentationFactory,
  PaymentFactory,
  PaymentMethodFactory
};