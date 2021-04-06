const _ = require('lodash')
const BadRequestException = require('../../exception/bad')
const PresentationService = require('./base')
const SendMailService = require('../mail/sendMail')
const Presentation = require('../../models/presentation')

module.exports = class SendCounterOfferService extends PresentationService
{
    constructor(user, data) {
      super(user, data)
      
      this.id = data.id
      this.counterOffer = data.counter_offer
    }

    async send() {
      await this.searchPresentation()
      await this.ensurePresentationWasFound()
      await this.ensureProposal()
      await this.ensureCounterOfferIsNotAccepted()
      await this.populateModel()
      await this.savePresentation()

      this.sendMail()
      this.createNotification()
      return this
    }

    ensureProposal() {
      if (this.presentation.status !== 'proposal') {
        throw new BadRequestException('Cannot save counter offer for non proposal')
      }

      return this
    }

    ensureCounterOfferIsNotAccepted() {
      if (this.presentation.proposal.counter_offer !== undefined && this.presentation.proposal.counter_offer.status === 'accepted') {
        throw new BadRequestException('Counter offer already accepted')
      }

      return this
    }

    populateModel() {
      this.presentation.proposal.counter_offer = this.counterOffer
      this.presentation.proposal.counter_offer.status = 'pending'
      
      // Counter offer price becomes proposal resulting price
      this.presentation.proposal.price = this.presentation.current_price;
      return this
    }

    sendMail() {
      console.log('Sending proposal mail...')
    }

    createNotification() {
      console.log('Creating proposal notification...')
    }
}
