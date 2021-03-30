const _ = require('lodash');
const BadRequestException = require('../../exception/bad');
const BaseService = require('../base');
const { User } = require('../../models');

module.exports = class SearchUnreadNotificationsService extends BaseService
{
    constructor(user) {
      super();

      this.id = user.id;
      this.notifications = [];
    }

    async search() {
      console.log('Searching unread notifications...');
      await this.searchFromUserById(this.id);
      this.ensureUserWasFound()
        .filterUnreadNotifications();

      return this;
    }

    async searchFromUserById(id) {
      this.user = await User.findById(id).populate('notifications');
      return this;
    }

    ensureUserWasFound() {
      if (!this.from instanceof User) {
        throw new BadRequestException('From user not found');
      }

      return this;
    }

    filterUnreadNotifications() {
      this.notifications = _.orderBy(
        _.filter(this.user.notifications, (notification) => !notification.read),
        ['created_at'],
        ['desc']
      );
 
      return this;
    }

    getNotifications() {
      return this.notifications;
    }
}