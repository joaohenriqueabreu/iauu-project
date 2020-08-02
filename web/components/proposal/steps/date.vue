<template>
  <div>
    <div class="horizontal d-flex justify-content-between mb-4">
      <div class="intro">
        <h6>Escolha a data do seu evento:</h6>
        <small class="mb-2">
          Esta é a agenda do artista. Clique em uma data, selecione um horário de início e arraste
          para determinar a duração do seu evento.
        </small>
        <small>
          Você pode propor até <u>{{ $config.maxProposedTimeslots }} opções</u> de datas para o
          artista responder com sua disponibilidade.
        </small>
      </div>
      <div class="horizontal center middle">
        <font-awesome icon="times"></font-awesome>
        <h6>Data Indisponível</h6>
      </div>
    </div>
    <div>
      <calendar
        ref="calendar"
        week-mode
        :timeslots="timeslots"
        class="content"
        :max="$config.maxProposedTimeslots"
        @event-click="removeProposalTimeslot"
        @selected="addTimeslot"
      ></calendar>
    </div>
    <input v-model="date" type="hidden" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Step from '@/components/proposal/steps/step'

const PROPOSED_TIMESLOT_ID_PREFIX = 'event_'
export default {
  extends: Step,
  props: {
    timeslots: { type: Array, default: () => {} }
  },
  data() {
    return {
      date: '',
      proposalTimeslotId: 1,
      proposedTimeslotCount: 0
    }
  },
  computed: {
    proposedTimeslots() {
      return this.$collection.filter(this.timeslots, (timeslot) => timeslot.type === 'event' && timeslot.id.startsWith(PROPOSED_TIMESLOT_ID_PREFIX))
    },
  },
  methods: {
    ...mapActions('schedule', ['loadSchedule', 'appendTimeslot', 'deselectTimeslot']),
    addTimeslot(selectedTimeslot) {
      // Assign timeslot as proposal
      selectedTimeslot.title = 'Proposta de data para o evento'
      selectedTimeslot.type = 'event'

      // assign some temp id
      selectedTimeslot.id = `${PROPOSED_TIMESLOT_ID_PREFIX}${this.proposalTimeslotId}`
      this.proposalTimeslotId++
      this.proposedTimeslotCount++

      // Schedule operation (will affect calendar but not proposal)
      this.appendTimeslot(selectedTimeslot)

      this.editProposal({ prop: 'timeslots', value: this.proposedTimeslots })

      if (this.proposedTimeslotCount === 1) {
        this.$toast.success(
          'OK! Selecione mais uma proposta de data para o evento ou clique na seta para a próxima etapa da proposta.'
        )
      }

      // Complete step
      this.$emit('complete')
    },
    removeProposalTimeslot({ eventId, timeslotId, type }) {
      if (type !== 'event') {
        return
      }
      this.deselectTimeslot(timeslotId)
      // Fullcalendar will update itself due to watcher

      if (this.timeslots.length) {
        this.$emit('incomplete')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.intro {
  max-width: 50vw;
}

[data-icon] {
  position: relative;
  display: block;
  width: 25px;
  height: 25px;
  font-size: $huge;
  background: $layer1;
  opacity: 0.5;
  padding: $space;
  border-radius: $rounded;
  color: $layer5;
  margin-right: 2 * $space;
}
</style>
