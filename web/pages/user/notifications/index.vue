<template>
  <div>
    <h4 class="mb-4">Notificações</h4>
    <div v-for="(notification, index) in notifications" :key="index">
      <div class="notification">
        <div>
          <h6><font-awesome class="mr-4" icon="bell"></font-awesome> {{ notification.message }}</h6>
        </div>
        <div class="d-flex justify-content-end">
          <small>{{ notification.created_at | timeAgo }}</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
data() {
    return {
      socket: {},
      notifications: []
    }
  },
  mounted() {
    const self = this
    self.socket = self.$nuxtSocket({
      name: 'notification',
      channel: '/notifications'
    })

    // Enter the presentation room
    self.socket.emit('login', self.$auth.user)

    /* Listen for events: */
    self.socket.on('unreadNotifications', (notifications) => { this.notifications = notifications })
    self.socket.on('newNotification', (notification) => { this.notifications.unshift(notification) })
  },
}
</script>

<style lang="scss" scoped>
  .notification {
    width: 100%;
    background: $layer3;
    border-radius: $edges;
    box-shadow: $shadow;
    transition: $transition;
    padding: 2 * $space;
    margin-bottom: 2 * $space;
    cursor: pointer;

    &:hover {
      transition: $transition;
      background: $layer4;
    }
  }
</style>