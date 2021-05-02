<template>
  <div>
    <div class="dropdown">
      <a id="dropdownMenuLink" class="dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <icon icon="bell" :class="!$empty(notifications) ? 'unread' : 'none'"></icon>
        <div class="num-notifications" v-if="!$empty(notifications)">
          {{ countUnreadNotifications }}
        </div>
      </a>
      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
        <div v-if="notifications.length === 0" class="p-3">
          <h6 class="no-new-notification">Nenhuma nova notificação</h6>
        </div>
        <div v-else>
          <div v-for="(notification, index) in displayNotifications" :key="index" class="dropdown-item vertical">
            <div @click="readNotification(notification)">
              <h6>{{ notification.message }}</h6>
              <div class="d-flex justify-content-end">
                <small>{{ notification.create_dt | timeAgo }}</small>
              </div>
              <hr/>
            </div>
          </div>
          <div class="dropdown-item" v-if="notifications.length > $config.maxNotificationsDisplayed">
            <nuxt-link to="/user/notifications">Ver mais</nuxt-link>
          </div>
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
    if (! process.env.areNotificationsEnabled) { return; }
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
    self.socket.on('notificationRead', (notifications) => { this.notifications = notifications })
  },
  computed: {
    countUnreadNotifications() {
      return !this.$empty(this.notifications) ? this.notifications.length : 0
    },
    displayNotifications() {
      return this.$array.slice(this.notifications, 0, this.$config.maxNotificationsDisplayed)
    },
    userRole() {
      return this.$auth.hasScope('artist') ? 'artist' : 'contractor'
    }
  },
  methods: {
    notificationLink(notification) {
      if (notification.type === 'role' && this.$auth.hasScope('artist')) { return '/artist/profile' }
      if (notification.type === 'product' && this.$auth.hasScope('artist')) { return '/artist/products' }
      if (notification.type === 'proposal') { return `/${this.userRole}/proposals` }
      if (notification.type === 'presentation') { return `/${this.userRole}/presentations` }
      return '/'
    },
    readNotification(notification) {
      this.socket.emit('read', this.$auth.user, notification)
      this.$router.push(this.notificationLink(notification))
    }
  }
}
</script>

<style lang="scss" scoped>
[data-icon] {
  margin-top: 2 * $space;
  border-radius: $rounded;
  box-shadow: $shadow;
  font-size: $huge;
  transition: $transition;
  background: $layer4;
  padding: $space;
  width: 30px;
  height: 30px;

  &.unread {
    color: $brandLayer;
  }

  &.none {
    color: $layer2;
  }

  &:hover {
    transition: $transition;
    color: $brand;
  }
}

.num-notifications {
  position: absolute;
  bottom: -10px;
  right: 0;
  background: $brandLayer;
  font-weight: $bold;
  width: 17px;
  height: 17px;
  border-radius: $rounded;
  color: $layer5;
  vertical-align: center;
  text-align: center;
  margin-bottom: 5px;
}

.dropdown-menu {
  background: $layer1;
  color: $brand;
  padding: 0;
  margin: 0;

  .dropdown-item {
    color: $brand !important;
    cursor: pointer;
    padding: 2 * $space;
    transition: $transition;
    &:hover {
      transition: $transition;
      background: $brandLayer;
      color: $layer2;
      hr { 
        transition: $transition;
        display: none;
      }
    }
  }
}

h6 {
  color: $brand;
  &.no-new-notification {
    color: $layer5;
  }
}

small {
  color: $layer5;
}

hr {
  margin: 0;
  border-top-color: $layer2;
}
</style>

<style lang="scss">
// Overwrite bootstrap style
.dropdown {
  .dropdown-toggle {
    position: relative;
    &:after {
      display: none;
    }
  }
}
</style>
