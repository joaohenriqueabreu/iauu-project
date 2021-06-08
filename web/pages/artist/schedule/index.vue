<template>
  <div class="calendar">
    <div class="d-flex justify-content-between">
      <div class="vertical mb-4">
        <span>Interaja com seus próximos eventos e responda a propostas de clientes</span>
      </div>
    </div>    
    <div v-if="timeslots">
      <calendar
        ref="calendar"
        class="content mb-5"
        week-mode
        owner-mode
        :timeslots="timeslots"
        @reload-events="reloadTimeslotsForYear"
        @event-click="handleEvent"
        @selected="openBusyModal">
      </calendar>
      <presentations-yearly v-if="timeslots.length > 0" @selected="navigateCalendar" class="hide-mobile"></presentations-yearly>      
      <busy ref="busy" @save="saveBusyTimeslot"></busy>      
      <proposal-details
        v-if="!$empty(proposal)"
        ref="proposal"
        @accepted="handleAcceptProposal"
        @rejected="handleRejectProposal">
      </proposal-details>      
    </div>
    <div class="caption horizontal middle mb-4 mr-4 hide-mobile">
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
import { mapState, mapActions } from 'vuex';
import Busy                     from '@/components/artist/schedule/busy';
import ProposalDetails          from '@/components/proposal/artist/details';
import PresentationsYearly      from '@/components/artist/schedule/yearly';
export default {
  components: {
    Busy,
    ProposalDetails,
    PresentationsYearly
  },
  async asyncData({ app, store }) {
    await store.dispatch('schedule/loadMySchedule', { year: new Date().getFullYear() })
  },
  data() {
    return {
      selectedTimeslot:       '',
      selectedProposalId:     null,
      selectedPresentationId: null
    }
  },
  computed: {
    ...mapState({ timeslots:    (state) => state.schedule.timeslots }),
    ...mapState({ proposal:     (state) => state.proposal.proposal }),
    ...mapState({ presentation: (state) => state.presentation.presentation })
  },
  methods: {
    ...mapActions('app', ['setAlert']),
    ...mapActions('schedule', ['loadMySchedule', 'saveTimeslot', 'removeTimeslot']),
    ...mapActions('proposal', ['loadProposal']),
    ...mapActions('presentation', [
      'acceptProposal',
      'rejectProposal',
      'confirmPresentation',
      'cancelPresentation'
    ]),    
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
    async reloadTimeslotsForYear(year) {
      await this.loadMySchedule({ year })
      this.$refs.calendar.loadCalendarEvents();
    },    
    async handleEvent({ eventId, timeslotId, type, status, presentationId }) {
      if (type === 'busy') {
        await this.removeTimeslot(timeslotId);
        this.$toast.success('Evento removido!');
        return;
      }      

      if (type === 'event' && status === 'proposal') {
        await this.loadProposal(presentationId);
        this.$refs.proposal.openModal();
        return;
      }

      if (type === 'event' && status === 'accepted') {
        this.$router.push({ path: `/artist/presentations/${presentationId}`, target: '_blank' });
      }
    },
    async saveBusyTimeslot(timeslot) {
      await this.saveTimeslot(timeslot);
      this.$refs.busy.closeModal();
    },
    async handleAcceptProposal(id) {
      this.$refs.proposal.closeModal();
      this.$toast.success('Uuhul! Apresentação confirmada. Vamos comunicar ao contratante e em breve entraremos em contato');
      this.$router.push(`/artist/presentations/${id}`);
    },
    async handleRejectProposal(id) {
      await this.loadMySchedule();
      this.$refs.calendar.refresh();
      this.$refs.proposal.closeModal();
      this.$toast.success('Proposta recusada com sucesso');
    },
    haveEventsOnDate(date) {
      const indexOfEvent = this.$array.findIndex(this.timeslots, (timeslot) => {
        return (
          ['proposal', 'presentation'].includes(timeslot.type) &&
          this.moment(date).isSame(this.moment(timeslot.start_dt), 'day')
        );
      })

      return indexOfEvent !== -1
    },
    navigateCalendar(monYear) {
      // console.log(this.$refs.calendar.fullcalendarApi);
      this.$refs.calendar.fullcalendarApi.gotoDate(this.moment(`01/${monYear}`, 'DD/MM/YYYY').toDate());
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

.calendar {
  height: 100%;
}

.caption {
  position: fixed;
  bottom:   0;
  right:    0;
}
</style>
