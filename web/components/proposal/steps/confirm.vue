<template>
  <div class="full-height vertical middle">
    <div class="confirm">
      <div>
        <h5>Enviar proposta?</h5>
        <small v-if="areAllStepsCompleted">
          O artista irá respondê-lo em breve. Qualquer duvida entre em contato conosco.
        </small>
      </div>
      <div class="review">
        <div class="top-right pt-1 pr-2">
          <icon icon="check-circle" class="m-0"></icon>
        </div>
        <h6 class="mb-4">
          Prezados integrantes do(a) <u>{{ proposal.artist.name }}</u>,
        </h6>
        <p class="mb-5">
          Solicito orçamento
          <span v-if="!$empty(proposal.product) && proposal.product.name !== 'custom'">
            do formato <b>{{ proposal.product.name }}</b></span>
          <span v-if="!$empty(proposal.title)">para o evento <u>{{ proposal.title }}</u></span>
          a ser realizado
          <span v-if="!$empty(proposal.location)">na <u>{{ proposal.location.toString() }}</u></span>
          <span v-if="!$empty(proposal.timeslots)">em <u>{{ proposal.timeslots[0].start_dt | longDate }}</u></span>
        </p>
        <div class="vertical center">
          <h1><icon icon="signature"></icon></h1>
          <hr class="light thick" />
          <h6>{{ $auth.user.name }}</h6>
        </div>

        <!-- <div>
          {{ proposal.title }}
        </div>
        <div v-if="!$empty(proposal.location)">
          {{ proposal.location.toString() }}
        </div>
        <div v-if="!$empty(proposal.timeslots)">
          {{ proposal.timeslots[0].start_dt | date }}
        </div>
        <div v-if="!$empty(proposal.product) && proposal.product.name !== 'custom'">
          <div>
            {{ proposal.product.name }}
          </div>
          <hr class="light thick" />
          <div class="d-flex justify-content-end">
            <h4>{{ proposal.product.price | currency }}</h4>
          </div> -->
      </div>
    </div>
    <div class="half-width horizontal middle center">
      <div v-if="areAllStepsCompleted">
        <form-button @action="submitProposal">Enviar!</form-button>
      </div>
      <div v-else class="vertical middle center">
        <h6>
          Ainda faltam alguns detalhes para finalizar a proposta
          <icon icon="frown"></icon>
        </h6>
        <small>Finalize os detalhes da apresentação para poder enviar a proposta</small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Step           from '@/components/proposal/steps/step';
export default {
  extends: Step,
  computed: {
    areAllStepsCompleted() {
      // do not count confirm step
      return !this.$empty(this.completedSteps) && this.completedSteps.length >= this.steps.length - 1;
    }
  },
  methods: {
    ...mapActions('proposal', ['sendProposal']),
    async submitProposal() {
      await this.sendProposal();
      this.$toast.success('Proposta enviada com sucesso!');
      this.$router.push('/');
    }
  }
}
</script>

<style lang="scss" scoped>
.review {
  @extend .vertical, .half-width;
  position: relative;
  // border: solid 4px $brand;
  // border-radius: $edges;
  margin: 3 * $space;
  padding: 4 * $space;
  background: $layer4;
  box-shadow: $shadow;
}

.confirm {
  @extend .vertical, .center, .middle, .full-height;
}

p {
  line-height: 20px;
}
</style>
