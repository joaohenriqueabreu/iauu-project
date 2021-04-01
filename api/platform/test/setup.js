// Setup environment to testing
process.env.NODE_ENV = 'test';
require("dotenv").config({ path: process.env.NODE_ENV === 'test' ? '.env.testing' : '.env'});

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const should = require('chai').should();
const expect = require('chai').expect;

const shouldLog = process.env.LOG_LEVEL === 'debug';

const dbConnection = require('../src/data/db');
const db = require('mongoose');

if (shouldLog) { db.set('debug', true); }

// Exceptions
const BadRequestException = require('../src/exception/bad');
const UnauthorizedException = require('../src/exception/unauthorized');

chai.use(sinonChai);

// General mock function to bypass any required service function (like sending mails for example)
const generalMock = () => { console.log('you have been mocked'); }

// Sinon stubs, mocks and spies sandbox
let sandbox = sinon.createSandbox();

const setup = async (runSeeds, createStubs) => {
  console.log('Starting to test db connection');
  await dbConnection.connect();

  if (typeof runSeeds === 'function') { runSeeds(); }

  if (typeof createStubs === 'function') {   
    if (! shouldLog) { sandbox.stub(console, 'log'); }

    createStubs(); 
  }
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

module.exports = {
  should, 
  expect, 
  BadRequestException, 
  UnauthorizedException,
  generalMock,
  sandbox,
  setup,
  cleanup
}