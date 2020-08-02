<template>
  <modal ref="modal" height="tiny">
    <template v-slot:header>
      <h5>Feedback da apresentação</h5>
    </template>
    <template v-slot:main>
      <div class="full-height">
        <div class="mb-4">Conta pra gente como foi sua experiência com <b>{{ otherParty.user.name }}</b></div>
        <div class="mb-4 horizontal middle center">
          <rating :read-only="false" @rated="setRating"></rating>
        </div>
        <div class="mb-4">
          <form-textarea class="full-width" placeholder="O que mais o artista fez que te encantou ou que você não curtiu? Conta pra gente" :rows="5" v-model="feedback.notes"></form-textarea>
        </div>
        <small>Agradecemos seu feedback!</small>
      </div>
    </template>
    <template v-slot:footer>
      <div class="vertical middle center">
        <form-button @action="send">Enviar</form-button>
      </div>
    </template>
  </modal>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    presentation: { type: Object, default: () => {}},
  },
  data() {
    return {
      feedback: {
        rating: 0,
        notes: ''
      }
    }
  },
  computed: {
    otherParty() {
      if (this.$auth.hasScope('artist')) {
        return this.presentation.contractor
      }

      return this.presentation.artist
    }
  },
  methods: {
    ...mapActions('artist', ['sendFeedback']),
    openModal() {
      this.$refs.modal.open()
    },
    closeModal() {
      this.$refs.modal.close()
    },
    setRating(rating) {
      this.feedback.rating = rating
    },
    async send() {
      await this.sendFeedback({ 
        id: this.presentation.artist.id, 
        presentation: {
          id: this.presentation.id
        },
        feedback: this.feedback 
      })
      this.$toast.success('Obrigado pelo seu feedback!')
      this.closeModal()
      this.$emit('sent')
    }
  }
}
</script>

<style>

</style>