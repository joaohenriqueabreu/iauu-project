const moment = require('moment');
const sinon = require('sinon');
const should = require('chai').should();
const expect = require('chai').expect;
const faker = require('faker');

const { cleanup, setup } = require('./setup');

// Set env test
process.env.NODE_ENV = 'test';

const db = require('mongoose');

// Exceptions
const BadRequestException = require('../src/exception/bad');
const UnauthorizedException = require('../src/exception/unauthorized');

// Models
const { User, Artist, Contractor } = require('../src/models');

// Services for seeding
const RegisterUserService = require('../src/services/auth/registerUser');
const VerifyUserService = require('../src/services/auth/verifyUser');
const AssignRoleService = require('../src/services/auth/assignRole');

// Services
const PublicArtistProfileService = require('../src/services/artist/publicSearch')
const SearchArtistForProposalService = require('../src/services/artist/searchArtistForProposal')
const SearchArtistProfileService = require('../src/services/artist/searchProfile')
const SaveArtistProfileService = require('../src/services/artist/saveProfile')
const SaveProductService = require('../src/services/artist/saveProduct')
const DeleteProductService = require('../src/services/artist/deleteProduct')
const SearchProductsService = require('../src/services/artist/searchProducts')
const SearchArtistUsersService = require('../src/services/artist/searchUsers')
const SendFeedbackService = require('../src/services/artist/sendFeedback')

// Share user among tests
let user = {}

const shouldLog = false
const generalMock = () => { console.log('you have been mocked') }

let sandbox = sinon.createSandbox()

const seed = async (numOfUsers) => {
  
}

describe('Artist testing', function () {
  before(async () => {
    await setup(async () => {
      console.log('Seeding some users...');
      for (let i = 0; i < 10; i++) {
        const name = faker.name.findName();
        const email = faker.internet.email();
        const registerUserSvc = new RegisterUserService(name, email, 'iauu');
        await registerUserSvc.register();

        const artistUser = registerUserSvc.getUser();
        const verifyUserSvc = new VerifyUserService(artistUser.verification.token);
        await verifyUserSvc.verify();

        const assignRoleSvc = new AssignRoleService(artistUser, 'artist');
        await assignRoleSvc.assign();
      }
    }, () => {
      // Stubs
      sandbox.stub(RegisterUserService.prototype, 'sendRegistrationMail').callsFake(generalMock);
      sandbox.stub(VerifyUserService.prototype, 'sendWelcomeMail').callsFake(generalMock);
    });
  })

  after(async () => {
    await cleanup();
  })

  describe('Asserting seed', function () {
    it('should have created 10 artist users', async () => {
      const users = await User.find({})

      users.should.have.lengthOf(10)

      users.forEach((user) => {
        user.verification.is_verified.should.be.true
        user.name.should.not.be.undefined
        user.email.should.not.be.undefined
        user.artist.should.not.be.undefined
      })
    })
  })
})