const _ = require('lodash');
const { sandbox, setup, cleanup, generalMock, should } = require('./setup');
const { 
  ProposalFactory, 
  AuthUserFactory, 
  UserFactory, 
  ArtistFactory, 
  ContractorFactory, 
  CounterOfferFactory,
  TimeslotFactory 
} = require('./factories');

// Services
const { 
  SearchProposalService, 
  SearchProposalsService, 
  SendProposalService, 
  SelectTimeslotService, 
  AcceptProposalService, 
  RejectProposalService, 
  SendCounterOfferService,
  AcceptCounterOfferService,
  RejectCounterOfferService,
} = require('../src/services/proposal');
const { UnauthorizedException } = require('lib/exception');

// Test-wide objects
let artistUser      = {};
let contractorUser  = {};
let authUser        = {};
let artist          = {};
let contractor      = {};
let proposal        = {};

describe('Proposal testing', () => {
  before(async () => { await setup(); });
  after(async ()  => { await cleanup(); });

  beforeEach(() => {});

  describe('Pre test seeding', () => {
    it('should save models', async () => {
      artistUser                = UserFactory.manufacture();
      artist                    = ArtistFactory.manufacture();

      artistUser.artist         = artist.id;
      artistUser.role           = 'artist';

      await artist.save();
      await artistUser.save();

      contractorUser            = UserFactory.manufacture();
      contractor                = ContractorFactory.manufacture();

      contractorUser.contractor = contractor.id;
      contractorUser.role       = 'contractor';
      
      await contractor.save();
      await contractorUser.save();

      authUser = AuthUserFactory.manufacture(contractorUser, contractor);
    });
  });

  describe('Service stubs', () => {
    it('should stub methods', () => {});
  });

  describe('Proposal Handling', () => {
    it('should send proposal', async () => {
      const sendProposalSvc = new SendProposalService(authUser);
      const proposalMock    = ProposalFactory.manufacture(false);
      proposalMock.artist   = artist;

      await sendProposalSvc.send(proposalMock);
      proposal = sendProposalSvc.getProposal();

      proposal.status.should.be.equal('proposal');
      proposal.artist_id.should.be.equal(artist.id);
      proposal.contractor_id.should.be.equal(authUser.role_id);
    });

    it('should find proposal', async () => {
      const searchProposalSvc = new SearchProposalService();
      await searchProposalSvc.search(proposal.id);
      const proposalFound     = searchProposalSvc.getProposal();
      
      proposalFound.should.not.be.null;
      proposalFound.id.should.be.equal(proposal.id);
    });

    it('should not find proposal with invalid id', async () => {
      const searchProposalSvc = new SearchProposalService();
      
      try {
        await searchProposalSvc.search('invalid id');
      } catch(error) {
        error.should.be.instanceof(Error);
      }
    });

    it('should not create proposal without timeslots', async () => {
      const sendProposalSvc   = new SendProposalService(authUser);
      const proposalMock      = ProposalFactory.manufacture(false);
      proposalMock.artist     = artist;
      proposalMock.timeslots  = [];

      try {
        await sendProposalSvc.send(proposalMock);
      } catch (error) {
        error.should.be.instanceof(Error);
      }
    });

    it('should select timeslot', async () => {
      const selectTimeslotSvc = new SelectTimeslotService(proposal.id);
      const timeslotMock      = TimeslotFactory.manufacture();

      await selectTimeslotSvc.select(timeslotMock);
      proposal = selectTimeslotSvc.getProposal();

      proposal.selected_timeslot.should.not.be.null;
      proposal.selected_timeslot.start_dt.should.be.equal(timeslotMock.start_dt);
    });

    describe('Counter offer', () => {
      it('should send counter offer', async () => {
        authUser = AuthUserFactory.manufacture(artistUser, artist);
        const sendCounterOfferSvc = new SendCounterOfferService(authUser, proposal.id);
        const counterOfferMock    = CounterOfferFactory.manufacture();
  
        await sendCounterOfferSvc.send(counterOfferMock);
        proposal = sendCounterOfferSvc.getProposal();
  
        proposal.counter_offer.should.not.be.null;
        proposal.counter_offer.price.should.be.equal(counterOfferMock.price);
      });
  
      it('should accept counter offer', async () => {
        const acceptCounterOfferSvc = new AcceptCounterOfferService(authUser, proposal.id);
        await acceptCounterOfferSvc.reply();

        const proposalWithAcceptedCounterOffer = acceptCounterOfferSvc.getProposal();

        proposalWithAcceptedCounterOffer.counter_offer.should.not.be.null;
        proposalWithAcceptedCounterOffer.counter_offer.status.should.be.equal('accepted');
      });

      it('should not accept already accepted counter offer', async () => {
        const acceptCounterOfferSvc = new AcceptCounterOfferService(authUser, proposal.id);
        try {
          await acceptCounterOfferSvc.reply();
        } catch (error) {
          error.should.be.instanceof(Error);
        }
      });

      it('should not allow non party-user to reply to counter offer', async () => {
        const newAuthUser           = AuthUserFactory.manufacture(UserFactory.manufacture(), ArtistFactory.manufacture());
        const acceptCounterOfferSvc = new AcceptCounterOfferService(newAuthUser, proposal.id);

        try {
          await acceptCounterOfferSvc.reply();
        } catch (error) {
          error.should.be.instanceof(UnauthorizedException);
        }
      });

      it('should reject counter offer', async () => {
        const sendProposalSvc       = new SendProposalService(AuthUserFactory.manufacture(contractorUser, contractor));
        const proposalMock          = ProposalFactory.manufacture(false);
        proposalMock.artist         = artist;

        await sendProposalSvc.send(proposalMock);
        const newProposal           = sendProposalSvc.getProposal();

        const sendCounterOfferSvc   = new SendCounterOfferService(authUser, newProposal.id);
        const counterOfferToReject  = CounterOfferFactory.manufacture();
        await sendCounterOfferSvc.send(counterOfferToReject);

        const rejectCounterOfferSvc = new RejectCounterOfferService(authUser, newProposal.id);
        await rejectCounterOfferSvc.reply();

        const rejectedProposal      = rejectCounterOfferSvc.getProposal();

        should.not.exist(rejectedProposal.counter_offer);
        rejectedProposal.rejected_counter_offers.length.should.equal(1);
        rejectedProposal.rejected_counter_offers[0].status.should.equal('rejected');
        rejectedProposal.rejected_counter_offers[0].price.should.equal(counterOfferToReject.price);
      });
    });
  });
});