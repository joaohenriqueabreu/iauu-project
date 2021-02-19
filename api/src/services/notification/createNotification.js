const eventHandler = require('../../events/handler');
const BadRequestException = require('../../exception/bad');
const BaseService = require('../base');
const { User } = require('../../models');

module.exports = class CreateNotificationService extends BaseService
{
    constructor(from, to, message, type, target) {
      super();

      if ([undefined, null].includes(from) ||
        !from instanceof User ||
        [undefined, null].includes(to) ||
        !to instanceof User ||
        [undefined, null].includes(message) ||
        [undefined, null].includes(type)) {
          throw new BadRequestException('Informações insuficientes');
        }

      this.from_id = from.id;
      this.to_id = to.id;
      this.message = message;
      this.type = type;
      this.target = target.id;

      this.from = {};
      this.to = {};
      this.notification = {};
    }

    async notify() {
      await this.searchFromUserById(this.from_id);
      await this.searchToUserById(this.to_id);
      this.ensureTypeIsValid()
        .ensureMessageIsValid()
        .buildNotification();

      await this.saveNotification();
      this.emitNewNotificationEvent();
      return this;
    }

    async searchFromUserById(id) {
      this.from = await User.findById(id);
      if (!this.from instanceof User) {
        throw new BadRequestException('From user not found');
      }

      return this;
    }

    async searchToUserById(id) {
      this.to = await User.findById(id).populate('notifications');
      if (!this.to instanceof User) {
        throw new BadRequestException('To user not found');
      }

      return this;
    }

    ensureTypeIsValid() {
      if (!['role', 'product', 'presentation', 'proposal'].includes(this.type)) {
        throw new BadRequestException('Invalid notification type');
      }

      return this;
    }

    ensureMessageIsValid() {
      if (this.message.length === 0) {
        throw new BadRequestException('Missing notification message');
      }

      return this;
    }

    buildNotification() {
      this.notification = {
        from: this.from.id,
        type: this.type,
        message: this.message,
        target: this.target
      };

      return this;
    }

    async saveNotification() {
      if ([undefined, null].includes(this.to.notifications)) { this.to.notifications = []; }
      this.to.notifications.push(this.notification);
      await this.to.save();
      return this;
    }

    emitNewNotificationEvent() {
      console.log('Emitting new notification event...');
      eventHandler.emit('newNotification', this.to, this.notification);
      return this;
    }
}