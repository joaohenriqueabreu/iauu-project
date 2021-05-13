const User          = require('./user');
const Artist        = require('./artist');
const Contractor    = require('./contractor');

const Proposal      = require('./proposal');
const Presentation  = require('./presentation');
const Billing       = require('./billing');

const Statistic     = require('./statistic');
const Feedback      = require('./feedback');

const ArtistAccount = require('./artistAccount');

const File          = require('./file');

module.exports = { 
  User, 
  File,
  Artist, 
  Contractor, 
  Proposal, 
  Presentation, 
  Statistic, 
  Feedback, 
  Billing, 
  ArtistAccount 
};