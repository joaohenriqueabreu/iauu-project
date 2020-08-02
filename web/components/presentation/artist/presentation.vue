<template>
  <div class="presentation-container">
    <modal ref="modal">
      <template v-slot:header>
        <div class="horizontal d-flex justify-content-between">
          <div v-if="!$empty(presentation.contractor)" class="horizontal middle">
            <avatar
              class="mr-4"
              :src="presentation.contractor.user.photo"
              :username="presentation.contractor.user.name"
            ></avatar>
            <h5>{{ presentation.contractor.user.name }}</h5>
          </div>
          <div class="d-flex align-items-end">
            <span class="identifier">Apresentação</span>
          </div>
        </div>
      </template>
      <template v-slot:main>
        <div class="boxed mb-4">
          <presentation-date :presentation="presentation"></presentation-date>
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
            Você já confirmou a apresentação! Obrigado. Estamos aguardando a confirmação do contratante para iniciar os procedimentos de pagamento.
            Caso não haja confirmação até dia <b>{{ confirmationDueDate | date }}</b> a apresentação será encerrada automaticamente e seu pagamento processado.
          </small>
        </div>
        <div class="horizontal center middle mb-3">
          <div class="mr-5">
            <form-button @action="confirm" v-if="hasPresentationStarted && !hasConfirmedPresentation">
              Confirmar Realização
            </form-button>
          </div>
          <div>
            <h5 v-if="!hasPresentationStarted" @click="openConfirmCancelModal">Cancelar</h5>
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
  computed: {
    hasPresentationStarted() {
      return this.moment(this.presentation.timeslot.start_dt).isBefore(this.moment())
    },
    hasConfirmedPresentation() {
      return this.presentation.confirm_status.includes('artist')
    },
    waitingForConfirmation() {
      return ! this.presentation.confirm_status.includes('contractor')
    },
    confirmationDueDate() {
      return this.moment(this.presentation.end_dt).add(15, 'days');
    }
  },
  methods: {
    ...mapActions('presentation', ['confirmPresentation', 'cancelPresentation']),
    openModal() {
      this.$refs.modal.open()
    },
    closeModal() {
      this.$refs.modal.close()
    },
    openConfirmCancelModal() {
      this.$refs.cancel.open()
    },
    closeCancelModal() {
      this.$refs.cancel.close()
    },
    async confirm() {
      await this.confirmPresentation(this.presentation.id)
      this.$toast.success("Obrigado por confirmar a realização da apresentação. Iniciaremos agora o faturamento da apresentação e você deverá receber seu pagamento em alguns dias.")
      this.closeModal()
      this.$emit('confirmed')
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
  }
}
</script>

<style lang="scss" scoped>
</style>
