<template>
  <div>
    <modal ref="modal">
      <template v-slot:header>
        <div class="horizontal d-flex justify-content-between">          
          <nuxt-link v-if="!$empty(presentation.artist)" :to="`/search/artists/${presentation.artist.slug}`" class="horizontal middle">
            <avatar
              class="mr-4"
              :src="presentation.artist.user.photo"
              :username="presentation.artist.user.name"
            ></avatar>
            <h5>{{ presentation.artist.user.name }}</h5>
          </nuxt-link>
          <div class="d-flex align-items-end">
            <span class="identifier">Apresentação</span>
          </div>
        </div>
      </template>
      <template v-slot:main>
        <div class="boxed mb-4">
          <presentation-date :presentation="presentation" @complete="confirm"></presentation-date>
        </div>
        <div class="mx-4 mb-4 vertical center middle">
          <h3 class="mb-4">{{ presentation.proposal.title }}</h3>
          <span>{{ presentation.proposal.description }}</span>
        </div>
        <div class="boxed mb-4">
          <presentation-address :presentation="presentation"></presentation-address>
        </div>
        <div class="mb-2 horizontal center middle">
          <h6>Apresentação contratada</h6>
        </div>
        <div class="boxed mb-4">
          <presentation-price :presentation="presentation" class="horizontal center middle"></presentation-price>
        </div>
        <div>
          <presentation-product :presentation="presentation" hide-price></presentation-product>
        </div>
      </template>
      <template v-slot:external>
        <chat v-if="!$empty(presentation)" :presentation="presentation"></chat>
      </template>
      <template v-if="!readOnly" v-slot:footer>
        <div v-if="hasConfirmedPresentation && waitingForConfirmation">
          <small>
            Você já confirmou a apresentação! Obrigado. Estamos aguardando a confirmação do artista para iniciar os procedimentos de pagamento.
            Caso não haja confirmação até dia <b>{{ confirmationDueDate | date }}</b> a apresentação será encerrada automaticamente e o pagamento será processado.
          </small>
        </div>
        <div class="horizontal center middle mb-3">
          <div class="mr-5" v-if="canConfirmPresentation && hasPresentationStarted && !hasConfirmedPresentation">
            <form-button @action="confirm">
              Confirmar Realização
            </form-button>
          </div>
          <div v-if="hasPresentationStarted && hasConfirmedPresentation" class="clickable my-4" @click="openFeedbackModal">
            <h4><u>Enviar Feedback</u></h4>
          </div>
          <div>
            <h5 v-if="!hasPresentationStarted" @click="openConfirmCancelModal" class="error">Cancelar Apresentação</h5>
          </div>
        </div>
        <div v-if="hasPresentationStarted && !hasConfirmedPresentation">
          <small>Apresentação realizada em {{ presentation.timeslot.start_dt | date }}, caso houve algum problema com a apresentação entrar em contato conosco imediatamente.</small>
        </div>
      </template>
    </modal>
    <modal ref="cancel" height="tiny">
      <template v-slot:main>
        <div class="horizontal middle center full-height">
          <h6 v-if="!hasPresentationStarted">Tem certeza que quer cancelar a apresentação? </h6>
          <h6 v-else>Não é possível cancelar a apresentação após sua data de realização</h6>
        </div>
      </template>
      <template v-slot:footer>
        <div class="horizontal center middle">
          <h6 class="clickable mr-4" @click="cancel">Sim, quero cancelar</h6>
          <form-button @action="closeCancelModal">Não, retornar para agenda</form-button>
        </div>
      </template>
    </modal>
    <presentation-feedback ref="feedback" @sent="handleFeedback" :presentation="presentation"></presentation-feedback>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BasePresentation from '../base'

export default {
  extends: BasePresentation,  
  props: {
    readOnly: { type: Boolean, default: true },
  },
  data() {
    return {
      isPresentationSelected: false
    }
  },
  computed: {
    canConfirmPresentation() {
      return this.presentation.status === 'accepted'
    },
    hasPresentationStarted() {
      return this.moment(this.presentation.timeslot.start_dt).isBefore(this.moment())
    },
    hasConfirmedPresentation() {
      return this.presentation.confirm_status.includes('contractor')
    },
    waitingForConfirmation() {
      return ! this.presentation.confirm_status.includes('artist')
    },
    confirmationDueDate() {
      return this.moment(this.presentation.end_dt).add(15, 'days');
    }
  },
  methods: {
    ...mapActions('presentation', ['confirmPresentation', 'cancelPresentation']),
    openModal() {
      this.$refs.modal.open()
      this.isPresentationSelected = true
    },
    closeModal() {
      this.$refs.modal.close()
      this.isPresentationSelected = false
    },
    openConfirmCancelModal() {
      this.$refs.cancel.open()
    },
    closeCancelModal() {
      this.$refs.cancel.close()
    },
    openFeedbackModal() {
      this.$refs.feedback.openModal()
    },
    async confirm() {
      try {
        await this.confirmPresentation(this.presentation.id)
        this.$toast.success(
          "Obrigado por confirmar a realização da apresentação. Iniciaremos agora o procedimento de pagamento. Por favor, reserve alguns minutos para avaliar o artista, seu feedback é muito importante.", 
          { duration: 10000 }
        )

        this.openFeedbackModal()
        this.$emit('confirmed')
      } catch (error) {
        this.$toast.info('Você já confirmou a realização da apresentação, obrigado!')
      }
    },
    async cancel() {
      try {
        await this.cancelPresentation(this.presentation.id)
        this.$toast.info("Apresentação cancelada")
        this.$emit('cancelled', this.presentation.id)
        this.closeCancelModal()
      } catch (error) {
        console.log(error)
        this.$toast.error(error)
      }
    },
    handleFeedback() {
      this.closeModal()
    }
  }
}
</script>

<style lang="scss" scoped>
.identifier {
  text-transform: uppercase;
  letter-spacing: $space / 2;
  color: $layer5;
  padding-right: 10 * $space;
  font-weight: $bold;
  border-bottom: 5px solid $layer3;
  border-radius: rounded;
}

.countdown {
  width: 100%;
  background: $layer3;
  box-shadow: $shadow;
  padding: 2 * $space;
  border-radius: $edges;
}

header {
  @extend .horizontal, .middle;
  justify-content: space-between;
  width: 100%;

  .vue-avatar--wrapper {
    margin-right: 2 * $space;
  }
}

main {
  @extend .vertical;
  margin-top: 2 * $space;
  margin-bottom: 2 * $space;
  padding: 2 * $space;
  box-shadow: $shadow;
  background: $layer3;
  border-radius: $edges;
  width: 100%;
  max-height: 60vh;
}

footer {
  @extend .horizontal, .center, .middle;
  margin-top: $space;

  h5 {
    color: transparentize($brand, 0.2);
    cursor: pointer;
    transition: $transition;

    &:hover {
      transition: $transition;
      color: $brand;
    }
  }
}
</style>
