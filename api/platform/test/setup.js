// Setup environment to testing
process.env.NODE_ENV = 'test';
const config = require('iauu/env');
// require("dotenv").config({ path: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env'});

const chai          = require('chai');
const sinon         = require('sinon');
const sinonChai     = require("sinon-chai");
const should        = require('chai').should();
const expect        = require('chai').expect;
const dbConnection  = require('../../lib/data/db');
const db            = require('mongoose');

if (config.shouldDebug()) { db.set('debug', true); }

// Exceptions
const { BadRequestException, UnauthorizedException } = require('iauu/exception');

chai.use(sinonChai);

// General mock function to bypass any required service function (like sending mails for example)
const generalMock = () => { console.log('You have been mocked'); }

// Sinon stubs, mocks and spies sandbox
let sandbox       = sinon.createSandbox();
const setup       = async (runSeeds, createStubs) => {
  console.log('Starting to test db connection');
  await dbConnection.connect();

  if (typeof runSeeds === 'function')     { runSeeds(); }
  if (typeof createStubs === 'function')  {
    if (! config.shouldDebug()) { sandbox.stub(console, 'log'); }

    createStubs(); 
  }

  // TODO perhaps we should mock BaseService sendMail and sendNotification generally here (mail could use mailtrap or interceptor)
}

const cleanup = async () => {
  // Remove stubs
  sandbox.restore();

  console.log('Exiting and cleanup...');
  for (const modelName in db.models) {
    console.log(`dumping ${modelName}...`);
    await db.model(modelName).deleteMany({});
  }

  db.disconnect();
}

module.exports = { should, expect, BadRequestException, UnauthorizedException, generalMock, sandbox, setup, cleanup }