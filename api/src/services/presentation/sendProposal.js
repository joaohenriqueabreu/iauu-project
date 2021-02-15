const _ = require('lodash');
const BadRequestException = require('../../exception/bad');
const PresentationService = require('./base');
const SendMailService = require('../mail/sendMail');
const CreateNotificationService = require('../notification/createNotification');
const { Presentation } = require('../../models');
const Location = require('../../models/structures/location');

module.exports = class SendProposalService extends PresentationService
{
    constructor(user, data) {
      super(user, data);

      this.proposal = data.proposal;
    }

    async save() {
      await this.ensureProposedTimeslotsDontOverlap();
      await this.createPresentation();
      await this.populateModel();
      await this.savePresentation();

      this.sendMail();
      this.createNotification();
      return this;
    }

    ensureProposedTimeslotsDontOverlap() {
      return this;
    }

    createPresentation() {
      this.presentation = new Presentation();
      this.presentation.status = 'proposal';
      this.contractorId = this.user.role_id;
      return this;
    }

    populateModel() {
      this.presentation.artist = this.proposal.artist.id;

      this.presentation.address = new Location(this.proposal.location);
      this.presentation.contractor = this.contractorId;

      // delete from incoming data so it's not copied inside model
      delete this.proposal.artist;
      delete this.proposal.location;
      this.presentation.proposal = this.proposal;

      // Calculate proposal price (either 0 at this point for custom product or product's price)
      this.presentation.proposal.price = this.presentation.current_price;      
      return this;
    }

    sendMail() {
      console.log('Sending proposal mail...');
      // const mailSvc = new SendMailService(this.user.email, 'Proposta enviada')
      // await mailSvc.buildBody('proposal', {})
      // await mailSvc.send()
      // return this
    }

    createNotification() {
      console.log('Creating proposal notification...');
      // const createNotificationService = new createNotificationService(this.user, this.proposal)
      // await createNotificationService.notify()
      // return this
    }
}