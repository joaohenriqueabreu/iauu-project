<template>
  <div>
    <div class="mb-5 half-width" v-if="counterOffer.status === 'void'">
      <form-button @action="openModal">Enviar orçamento para o organizador do evento</form-button>
    </div>
    <div v-else class="vertical middle center offer m-4" :class="counterOffer.status">
      <h5 class="mb-3">Orçamento enviado <u>{{ counterOfferStatusText }}</u></h5>
      <div class="horizontal">
        <h6 class="mr-2">{{ counterOffer.price | currency}}</h6> para <h6 class="mx-2">{{ counterOffer.duration }} horas</h6> de apresentação
        <h6 class="mx-2 clickable" v-if="!hasAcceptedCounterOffer" @click="openModal"><font-awesome icon="edit"></font-awesome></h6>
      </div>
    </div>
    <modal ref="modal" height="tiny">
    <template v-slot:header>
      <h6>Orçamento de apresentação</h6>
    </template>
    <template v-slot:main>
      <div class="vertical middle center">
        <span>Envie o valor e duração de sua apresentação para avaliação pelo contratante</span>
        <form-money ref="price" v-model="$v.counterOffer.price.$model" label="Valor (R$)" class="mt-4 mb-1"></form-money>
        <div class="error mb-3" v-if="$v.counterOffer.price.$error">Favor entrar com um valor válido</div>
        <form-numeric v-model="$v.counterOffer.duration.$model" icon="clock" label="Duração (horas)"></form-numeric>
        <div class="error mb-3" v-if="$v.counterOffer.duration.$error">Favor entrar com um valor válido</div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="horizontal center middle">
        <div class="mr-4">
          <form-button v-if="!$v.$invalid" @action="send">Enviar</form-button>
        </div>
        <div>
          <h6 class="clickable" @click="cancel">Cancelar</h6>
        </div>
      </div>
    </template>
  </modal>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { required, minValue, numeric } from 'vuelidate/lib/validators'
export default {
  validations: {
    counterOffer: {
      price: { required, numeric, minValue: minValue(1) },
      duration: { required, numeric, minValue: minValue(1) }
    }
  },
  props: {
    presentation: { type: Object, default: () => {}}
  },
  created() {
    if (!this.$empty(this.presentation.proposal.counterOffer)) {
      this.counterOffer = this.$object.clone(this.presentation.proposal.counterOffer)
    }
  },
  data() {
    return {
      counterOffer: {
        price: 0,
        duration: 0,
        status: 'void'
      }
    }
  }, 
  computed: {
    hasAcceptedCounterOffer() {
      return this.counterOffer.status === 'accepted'
    },
    counterOfferStatusText() {
      if (this.counterOffer.status === 'pending') {
        return 'Aguardando resposta do organizador do evento'
      }

      if (this.counterOffer.status === 'accepted') {
        return 'Orçamento aceito pelo organizador do evento!'
      }

      if (this.counterOffer.status === 'rejected') {
        return 'Orçamento rejeitado, cancele a proposta ou envie um novo orçamento'
      }

      return ''
    },
  },
  methods: {
    openModal() {
      this.$refs.modal.open()
    },
    send() {
      this.$emit('send', this.counterOffer)
    },
    cancel() {
      this.$refs.modal.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.offer {
  padding: 2 * $space;
  &.accepted {
    background: $brandLayer;
    color: $layer1;
    border-radius: $edges;
  }
}
</style>