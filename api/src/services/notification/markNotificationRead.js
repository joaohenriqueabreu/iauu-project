const _ = require('lodash')
const BadRequestException = require('../../exception/bad')
const BaseService = require('../base')
const { User } = require('../../models')

module.exports = class CreateNotificationService extends BaseService
{
    constructor(user, notification) {
      super()

      this.id = user.id
      this.notification = notification.id

      this.to = {}
    }

    async markRead() {
      await this.searchToUserById(this.id)
      this.internalMarkNotificationRead()
      await this.saveNotification()
      return this
    }

    async searchToUserById(id) {
      this.to = await User.findById(id).populate('notifications')
      if (!this.to instanceof User) {
        throw new BadRequestException('To user not found')
      }

      return this
    }

    internalMarkNotificationRead() {
      _.forEach(this.to.notifications, (notification) => {
        if (notification.id === this.notification && !notification.read) {
          notification.read = true
          return
        }
      })

      return this
    }

    async saveNotification() {
      await this.to.save()
      return this
    }
}
