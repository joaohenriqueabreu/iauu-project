<template>
  <div>
    <div class="d-flex justify-content-between">
      <div class="vertical mb-4">
        <span>Interaja com seus próximos eventos e responda a propostas de clientes</span>
      </div>
    </div>
    <div v-if="timeslots">
      <calendar
        ref="calendar"
        class="content"
        week-mode
        owner-mode
        :timeslots="timeslots"
        @reload-events="reloadTimeslotsForYear"
        @event-click="handleEvent"
        @selected="openBusyModal"
      ></calendar>
      <busy ref="busy" @save="saveBusyTimeslot"></busy>
      <div v-if="!$empty(presentation)">
        <proposal
          v-if="!$empty(presentation.proposal) && presentation.status === 'proposal'"
          ref="proposal"
          @accepted="handleAcceptProposal"
          @rejected="handleRejectProposal"
        ></proposal>
        <presentation
          v-if="!$empty(presentation) && ['accepted', 'completed', 'cancelled'].includes(presentation.status)"
          ref="presentation"
          :read-only="false"
          @confirmed="handleConfirmPresentation"
          @cancelled="handleCancelPresentation"
        ></presentation>
      </div>
    </div>
    <div class="horizontal middle center text-right">
      <div class="horizontal middle mr-4">
        <span class="event-subtitle proposal"></span>
        <h6>Proposta</h6>
      </div>
      <div class="horizontal middle">
        <span class="event-subtitle presentation"></span>
        <h6>Apresentação</h6>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BusySlot from '@/components/artist/schedule/busy'
import Proposal from '@/components/presentation/artist/proposal'
import Presentation from '@/components/presentation/artist/presentation'
export default {
  components: {
    busy: BusySlot,
    proposal: Proposal,
    presentation: Presentation
  },
  async asyncData({ app, store }) {
    await store.dispatch('schedule/loadMySchedule', { year: new Date().getFullYear() })
  },
  data() {
    return {
      selectedTimeslot: '',
      selectedProposalId: null,
      selectedPresentationId: null
    }
  },
  computed: {
    ...mapState({ timeslots: (state) => state.schedule.timeslots }),
    ...mapState({ presentation: (state) => state.presentation.presentation })
    // ...mapState({ proposal: (state) => state.presentation.proposal })
  },
  methods: {
    ...mapActions('presentation', [
      'loadProposal',
      'loadPresentation',
      'acceptProposal',
      'rejectProposal',
      'confirmPresentation',
      'cancelPresentation'
    ]),
    ...mapActions('schedule', ['loadMySchedule', 'saveTimeslot', 'removeTimeslot']),
    ...mapActions('app', ['setAlert']),
    async reloadTimeslotsForYear(year) {
      await this.loadMySchedule({ year })
      this.$refs.calendar.loadCalendarEvents()
    },
    openBusyModal(timeslot) {
      if (this.haveEventsOnDate(timeslot)) {
        this.$toast.error(
          'Existem apresentações ou propostas neste dia, cancele-as antes de marcar como indisponível'
        )
        return
      }

      this.selectedTimeslot = timeslot
      this.$refs.busy.openModal(timeslot)
    },
    async handleEvent({ eventId, timeslotId, type, status, presentationId }) {
      if (type === 'busy') {
        await this.removeTimeslot(timeslotId)
        this.$toast.success('Evento removido!')
        return
      }

      await this.loadPresentation(presentationId)

      if (type === 'event' && status === 'proposal') {
        this.$refs.proposal.openModal()
        return
      }

      if (type === 'event' && status === 'accepted') {
        this.$refs.presentation.openModal()
      }
    },
    async saveBusyTimeslot(timeslot) {
      await this.saveTimeslot(timeslot)
      this.$refs.busy.closeModal()
    },
    async handleAcceptProposal(id) {
      await this.loadMySchedule()
      this.$refs.calendar.refresh()
      this.$refs.proposal.closeModal()
      this.$toast.success('Uuhul! Apresentação confirmada. Vamos comunicar ao contratante e em breve entraremos em contato')
    },
    async handleRejectProposal(id) {
      await this.loadMySchedule()
      this.$refs.calendar.refresh()
      this.$refs.proposal.closeModal()
      this.$toast.success('Proposta recusada com sucesso')
    },
    async handleConfirmPresentation(id) {
      await this.loadMySchedule()
      this.$refs.calendar.refresh()
      this.$refs.presentation.closeModal()
    },
    async handleCancelPresentation(id) {
      await this.loadMySchedule()
      this.$refs.calendar.refresh()
      this.$refs.presentation.closeModal()
    },
    haveEventsOnDate(date) {
      const indexOfEvent = this.$array.findIndex(this.timeslots, (timeslot) => {
        return (
          ['proposal', 'presentation'].includes(timeslot.type) &&
          this.moment(date).isSame(this.moment(timeslot.start_dt), 'day')
        )
      })

      return indexOfEvent !== -1
    }
  }
}
</script>

<style lang="scss" scoped>
.event-subtitle {
  height: 30px;
  width: 30px;
  border-radius: $rounded;
  margin-right: $space;
  &.proposal {
    background: $proposalTimeslot;
  }

  &.presentation {
    background: $presentationTimeslot;
  }
}
</style>
