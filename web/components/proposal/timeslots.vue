<template>
  <div class="timeslots">
    <div v-if="!readOnly">
      <h6 class="mb-3"><icon icon="calendar-alt"></icon>Aguardando confirmacao de data pelo artista. <u class="clickable brand-hover" @click="openModal">Adicionar data</u></h6>
      <div class="horizontal center middle">
        <div v-for="(timeslot, index) in proposal.timeslots" :key="index" class="timeslots">
          <span class="timeslot">{{ timeslot.start_dt | datetime }} <icon icon="times" class="ml-3 brand-hover clickable" @click="removeTimeslot(index)"></icon></span>
        </div>
      </div>
      <modal single ref="modal">
        <template v-slot:header><h4>Adicionar data a proposta</h4></template>
        <template v-slot:main>
          <div class="mb-4">
            <form-date v-model="$v.newTimeslot.start_dt.$model"></form-date>
            <form-validation :error="$v.newTimeslot.start_dt.$error">Entre com uma data válida</form-validation>
          </div>
          <div class="text-center half-width">
            <form-button :disabled="$v.newTimeslot.$invalid" @action="addTimeslot">Salvar</form-button>
          </div>     
        </template>
      </modal>
    </div>
    <div v-else class="timeslots">
      <div v-for="(timeslot, index) in proposal.timeslots" :key="index">
        <span class="timeslot" :class="{ selected: isTimeslotSelected(timeslot) }">{{ timeslot.start_dt | datetime }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {required}   from 'vuelidate/lib/validators';
import {mapActions} from 'vuex';
import Timeslot     from '@/models/timeslot';
import moment       from 'moment';

const future = (date) => {
  return moment(date).diff(moment()) > 0;
}

export default {
  props: {
    readOnly: { type: Boolean, default: false },
    proposal: {}
  },
  data() {
    return {
      newTimeslot: {
        start_dt: ''
      }
    }
  },
  validations: {
    newTimeslot: {
      start_dt: {required, future}      
    }
  },
  methods: {
    ...mapActions('proposal', ['updateProposal']),
    openModal() {
      this.newTimeslot      = new Timeslot();
      this.newTimeslot.type = 'event';
      this.$refs.modal.open();
    },
    async addTimeslot() {
      const timeslots = this.$object.clone(this.proposal.timeslots);
      timeslots.push(this.newTimeslot);
      await this.updateProposal({timeslots});
      this.$toast.success('Data adicionada com sucesso');
      this.$refs.modal.close();
    },
    async removeTimeslot(index) {
      const timeslots = this.$object.clone(this.proposal.timeslots);
      this.$delete(timeslots, index);
      await this.updateProposal({timeslots});
      this.$toast.success('Data removida com sucesso');
    },
    isTimeslotSelected(timeslot) {
      return this.proposal.has_selected_timeslot && timeslot.start_dt === this.proposal.selected_timeslot.start_dt
    }
  }
}
</script>

<style lang="scss" scoped>
.timeslots {
  display:    flex;
  flex-wrap:  1;

  .timeslot {
    display:          flex;
    flex-direction:   row;
    justify-content:  space-between;
    border-radius:    $rounded;
    background:       $layer5;
    padding:          $space;
    margin-right:     2 * $space;

    &.selected {
      background:     $brandLayer;
      color:          $layer1;
      font-weight:    $bold;
    }
  }  
}
</style>