<template>
  <div>
    <form @submit.prevent="submit">
      <main>
        <fade-transition mode="out-in">
          <!-- Timeslots is only required for dateSteps -->
          <component
            :is="stepComponent"
            :timeslots="timeslots"
            :proposal="proposal"
            :products="products"
            class="step"
            :steps="proposalStepComponents"
            :completed-steps="completedSteps"
            @complete="completeStep"
            @incomplete="revertStep"
            @next="nextStep"
          ></component>
        </fade-transition>
      </main>
    </form>
    <footer class="row">
      <div class="col-2 d-flex justify-content-start">
        <!-- Including any content so that col- will be displayed eventhough the arrow btn is hidden -->
        &nbsp;
        <icon v-show="canPrevious" icon="arrow-left" @click="previousStep"></icon>
      </div>
      <div class="col-8 horizontal center middle">
        &nbsp;
        <timeline
          :steps="proposalStepComponents.length" 
          :completed="completedSteps" 
          :current="currentStep" 
          :icons="proposalStepIcons" 
          :labels="proposalStepLabels" 
          @goto="goToStep">
        </timeline>
      </div>
      <div class="col-2 d-flex justify-content-end pr-3">
        &nbsp;
        <icon v-show="canNext" icon="arrow-right" @click="nextStep"></icon>
      </div>
    </footer>
  </div>
</template>

<script>
import DateStep     from '@/components/proposal/steps/date';
import ProductStep  from '@/components/proposal/steps/product';
import DetailsStep  from '@/components/proposal/steps/details';
import ConfirmStep  from '@/components/proposal/steps/confirm';
export default {
  layout: 'guest',
  // Load all required data for components (they get re-rendered everytime we switch components)
  // Variables are passed by reference so it's ok.
  async asyncData({ app, store, route }) {
    // Required for dateStep
    const today = new Date();
    await store.dispatch('schedule/loadSchedule', { id: route.params.id, year: today.getFullYear(), month: today.getMonth() });

    // if page was reloaded we will lose artist data, verify and reload if necessary
    if (app.$utils.empty(store.state.artist)) {
      await store.dispatch('artist/loadArtistPublicProfile', route.params.id);
    }

    await store.dispatch('artist/loadProducts', route.params.id);
    await store.dispatch('proposal/initProposal', route.params.id);

    return {
      proposal:   store.state.proposal.proposal,
      products:   store.state.artist.artist.products,
      timeslots:  store.state.schedule.timeslots
    }
  },
  data() {
    return {
      currentStep: 0,
      completedSteps: [],
      proposalStepComponents: [DateStep, ProductStep, DetailsStep, ConfirmStep],
      proposalStepIcons: ['calendar-alt', 'shopping-cart', 'map-marker-alt' , 'envelope'],
      proposalStepLabels: ['Data do evento', 'Escolha seu produto', 'Mais detalhes sobre o evento', 'Enviar proposta']
    }
  },
  computed: {
    // ...mapState({ timeslots: (state) => state.schedule.timeslots }),
    stepComponent() {
      return this.proposalStepComponents[this.currentStep];
    },
    canPrevious() {
      return this.currentStep > 0;
    },
    canNext() {
      return this.currentStep < this.proposalStepComponents.length - 1;
    },
  },
  methods: {
    submit() {
      // do nothing for now
    },
    completeStep() {
      this.completedSteps.push(this.currentStep);
    },
    revertStep() {
      this.$delete(this.completedSteps, this.currentStep);
    },
    nextStep() {
      this.currentStep++;
    },
    previousStep() {
      this.currentStep--;
    },
    goToStep(step) {
      this.currentStep = step;
    }
  }
}
</script>

<style lang="scss" scoped>
main {
  // @extend .vertical, .center, .middle;
  padding: $space;
  .step {
    min-height: 75vh;
    width: 100%;
    padding: $space;
    margin-bottom: 20vh;
  }
}

footer {
  @extend .horizontal, .middle;
  position: fixed;
  bottom: 0;
  background: $layer1;
  height: 10vh;
  width: 100vw;
  margin: 0;
  z-index: $secondLayer;

  [data-icon] {
    cursor: pointer;
    padding: 2 * $space;
    margin: 0 2 * $space;
    background: $layer5;
    width: 50px;
    height: 50px;
    border-radius: $rounded;
    box-shadow: $shadow;
    transition: $transition;

    &:hover {
      transition: $transition;
      background: $brandLayer;
    }
  }
}
</style>
