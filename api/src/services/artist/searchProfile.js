const ArtistService = require('./base')
const CreateNotificationService = require('../notification/createNotification')
const { User } = require('../../models')

module.exports = class SearchArtistProfileService extends ArtistService
{
    constructor(user, data) {
      super(user)
    }

    async search() {
      await this.searchArtistWithUsers()
      this.ensureArtistWasFound()

      // Temp event
      console.log('Sending temporary notification...')
      const to = await User.findOne({ email: 'toca@raul.com.br' })
      const from = await User.findOne({ email: 'luan@santana.com.br' })
      const createNotificationSvc = new CreateNotificationService(from, to, 'New notification', 'user', to.id)
      await createNotificationSvc.notify()
      return this
    }
}
