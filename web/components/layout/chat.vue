<template>
  <div>
    <portal to="chat">
      <beautiful-chat
        v-if="!$empty(presentation) && authorized"
        :participants="participants"
        :title-image-url="titleImageUrl"
        :on-message-was-sent="onMessageWasSent"
        :message-list="messageList"
        :new-messages-count="newMessagesCount"
        :is-open="isChatOpen"
        :close="closeChat"
        :icons="icons"
        :open="openChat"
        :show-emoji="true"
        :show-file="false"
        :show-edition="false"
        :show-deletion="false"
        :show-typing-indicator="showTypingIndicator"
        :placeholder="placeholder"
        :show-launcher="true"
        :show-close-button="true"
        :colors="colors"
        :always-scroll-to-bottom="alwaysScrollToBottom"
        :message-styling="messageStyling">
        <template v-slot:header>
          <div class="horizontal ml-4">
            <avatar v-if="!$empty(otherParty.photo)" :src="otherParty.photo" :username="otherParty.name" :size="50" class="mr-4">
            </avatar>
            <div class="vertical">
              <h6>{{ otherParty.name }}</h6>
              <span class="mr-2">{{ presentation.proposal.title }}</span>
              <span class="horizontal middle">
                <icon icon="calendar-alt" class="mr-2"></icon>
                {{ presentationDate | date }}
              </span>
            </div>
          </div>
        </template>
        <template v-slot:text-message-body="{ message }">
          <div class="vertical">
            <h6 v-if="message.author !== 'me'" class="mb-2">{{ message.author }}</h6>
            <span class="mb-2">{{ message.data.text }}</span>
            <span class="d-flex justify-content-end full-width message-date">
              {{ message.create_dt | datetime }}
            </span>
          </div>
        </template>
      </beautiful-chat>
    </portal>
  </div>
</template>

<script>
// Using icons as computed props is not working for chat, render prior
const openIcon      = `${process.env.cdnStaticAssetsDomain}/chat/logo-no-bg.svg`
const closeIcon     = `${process.env.cdnStaticAssetsDomain}/chat/close-icon.png`
const fileIcon      = `${process.env.cdnStaticAssetsDomain}/chat/file.svg`
const closeIconSvg  = `${process.env.cdnStaticAssetsDomain}/chat/close.svg`

export default {
  props: {
    presentation: { type: Object, default: () => {} }
  },
  data() {
    return {
      authorized:   false,
      socket:       {},
      messageList:  [],
      icons: {
        open:     { img: openIcon,      name: 'default' },
        close:    { img: closeIcon,     name: 'default' },
        file:     { img: fileIcon,      name: 'default' },
        closeSvg: { img: closeIconSvg,  name: 'default' }
      },
      titleImageUrl:        'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      newMessagesCount:     0,
      isChatOpen:           false,
      showTypingIndicator: '',
      colors: {
        header:           { bg: this.$config.colors.brandLayer, text: this.$config.colors.layer1 },
        launcher:         { bg: this.$config.colors.brandLayer },
        messageList:      { bg: this.$config.colors.white },
        sentMessage:      { bg: this.$config.colors.brandLayer, text: this.$config.colors.layer1 },
        receivedMessage:  { bg: this.$config.colors.layer7, text: this.$config.colors.white },
        userInput:        { bg: this.$config.colors.layer10, text: this.$config.colors.layer1 }
      },
      placeholder:          'Escreva uma mensagem...',
      alwaysScrollToBottom: true,
      messageStyling:       true
    }
  },
  computed: {
    participants() {
      return [
        {
          id:       this.presentation.artist.id,
          name:     this.presentation.artist.name,
          imageUrl: this.presentation.artist.photo
        },
        {
          id:       this.presentation.contractor.id,
          name:     this.presentation.contractor.name,
          imageUrl: this.presentation.contractor.photo
        }
      ]
    },
    presentationDate() {
      if (this.presentation.status === 'proposal') {
        return this.presentation.proposal.timeslots[0].start_dt;
      }

      return this.presentation.timeslot.start_dt;
    },
    otherParty() {
      if (this.$auth.hasScope('artist')) { return this.presentation.contractor; }

      return this.presentation.artist;
    }
  },
  mounted() {
    if (! process.env.isChatEnabled) { return; }

    const self  = this;
    self.socket = self.$nuxtSocket({ name: 'chat', channel: '/chat' });

    // Enter the presentation room
    self.socket.emit('join', self.$auth.user, self.presentation.id);

    /* Listen for events: */
    self.socket.on('welcome', (messages) => {
      self.authorized = true;
      if (!self.$empty(messages)) {
        messages.forEach((message) => {
          self.messageList.push(self.parseMessageAuthor(message))
        })
      }
    })

    self.socket.on('received', (message) => {
      console.log(message);
      self.messageList.push(self.parseMessageAuthor(message));
    })
  },
  methods: {
    parseMessageAuthor(message) {
      message.author = !this.$empty(message.author) && message.author.id === this.$auth.user.id
          ? 'me'
          : message.author.name

      return message
    },
    sendMessage(text) {
      // if (text.length > 0) {
      //   this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
      //   this.onMessageWasSent({ author: 'support', type: 'text', data: { text } })
      // }
    },
    onMessageWasSent(message) {
      // Parse author to user id
      message.author = { id: this.$auth.user.id, name: this.$auth.user.name }
      this.socket.emit('send', this.$auth.user, message);
    },
    openChat() {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen       = true;
      this.newMessagesCount = 0;
    },
    closeChat() {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false;
    },
    handleScrollToTop() {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    }
  }
}
</script>

<style lang="scss" scoped>
.message-date {
  font-size: 8px;
  float: right;
}
</style>

<style lang="scss">
.sc-launcher {
  z-index: 10 * $moveToTop;
  &.opened {
    z-index: 0;
  }
}

.sc-chat-window {
  /** overwrite ChatWindow.vue */
  font-family: Gotham, Roboto !important;
  &.opened {
    z-index: 10 * $moveToTop;
  }

  .sc-header--close-button {
    position: absolute;
    top: 5px;
    right: 5px;

    &:hover {
      box-shadow: none;
      color: $layer3;
    }
  }

  .sc-user-input--button {
    margin-left: 2 * $space;
  }

  .sc-message--content {
    &.received {
      .sc-message--text,
      .sc-message--file {
        border-top-left-radius: 0;
      }
    }

    &.sent {
      .sc-message--text,
      .sc-message--file {
        border-top-right-radius: 0;
      }
    }
  }
}
</style>
