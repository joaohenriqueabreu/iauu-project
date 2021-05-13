const _ = require('lodash')
const BadRequestException = require('../../exception/bad')
const BaseService = require('../base')
const { User } = require('../../models')

module.exports = class CreateNotificationService extends BaseService
{
    constructor(user, notification) {
      super()

      this.id = user.id
      this.notificationId = notification.id

      this.to = {}
    }

    async markRead() {
      await this.searchToUserById(this.id)
      this.deleteNotification()
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

    deleteNotification() {
      this.to.notifications = _.filter(this.to.notifications, (notification) => {
        return notification.id !== this.notificationId
      })

      return this
    }

    internalMarkNotificationRead() {
      _.forEach(this.to.notifications, (notification) => {
        if (notification.id === this.notificationId && !notification.read) {
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

    getNotifications() {
      return this.to.notifications
    }
}