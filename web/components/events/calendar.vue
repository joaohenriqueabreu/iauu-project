<template>
  <div>
    <FullCalendar
      ref="fullcalendar"
      default-view="dayGridMonth"      
      nav-link-day-click="timeGridWeek"
      theme="bootstrap"
      locale="pt-br"
      content-height="auto"
      height="parent"
      width="parent"
      slot-duration="01:00:00"
      slot-label-interval="04:00:00"
      :nav-links="weekMode"
      :events="calendarEvents"
      :plugins="calendarPlugins"
      :aspect-ratio="0.5"
      :select-long-press-delay="250"
      :selectable="true"
      :editable="true"
      :event-overlap="true"
      :now-indicator="false"
      :all-day-slot="false"
      :show-non-current-dates="false"
      :header="headerButtons"
      :button-text="buttonText"
      :column-header-format="columnHeaderFormat"
      :slot-label-format="slotLabelFormat"
      :event-time-format="eventTimeFormat"
      :dates-destroy="datesDestroy"
      @select="selected"
      @dateClick="dateClick"
      @eventClick="eventClick"
    />
  </div>
</template>

<script>
import moment             from 'moment';
import FullCalendar       from '@fullcalendar/vue';
import dayGridPlugin      from '@fullcalendar/daygrid';
import timeGridPlugin     from '@fullcalendar/timegrid';
import interactionPlugin  from '@fullcalendar/interaction';
import bootstrapPlugin    from '@fullcalendar/bootstrap';
import Timeslot           from '@/models/timeslot';

export default {
  components: {
    FullCalendar
  },
  props: {
    timeslots:        { type: Array,    default: () => {} },
    timeslotsByType:  { type: Object,   default: () => {} },
    readOnly:         { type: Boolean,  default: true },
    weekMode:         { type: Boolean,  default: false },
    ownerMode:        { type: Boolean,  default: false },
    max:              { type: Number,   default: null },
    futureOnly:       { type: Boolean,  default: true }
  },
  data() {
    return {
      calendarPlugins:  [interactionPlugin, dayGridPlugin, timeGridPlugin, bootstrapPlugin],
      calendarEvents:   [],
      currentYear:      0,  // store to fetch new events when user switches year
      proposalsPerDay:  {}, // store number of events for a given day, so we can group if they exceed max allowed
      allTimeslots:     [],
    }
  },
  computed: {
    defaultView() {
      return this.weekMode ? 'timeGridWeek' : 'dayGridMonth';
    },
    busyDates() {
      const self = this;
      const busyTimeslots = this.$array.filter(this.timeslots, (timeslot) => 
        !self.$empty(timeslot) && self.isUnavailable(timeslot)
      );

      return this.$array.map(busyTimeslots, 'start_dt');
    },
    unavailableTimeslots() {
      const self = this;
      return this.$array.filter(this.timeslots, (timeslot) => 
        !self.$empty(timeslot) && self.isUnavailable(timeslot)
      );
    },
    availableTimeslots() {
      const self = this;
      return this.$array.filter(this.timeslots, (timeslot) => 
        !self.$empty(timeslot) && !self.isUnavailable(timeslot)
      );
    },
    headerButtons: () => {
      return {
        left:   'title',
        center: 'timeGridWeek, dayGridMonth',
        right:  'today, prev, next, nextYear'
      }
    },
    buttonText: () => {
      return {
        today:  'Hoje',
        month:  'Mês',
        week:   'Semana',
        day:    'Dia',
        timeWeekGrid: 'Ver semana'
      }
    },
    titleFormat: () => {
      return {}
    },
    slotLabelFormat: () => {
      return {
        hour:           'numeric',
        minute:         '2-digit',
        meridiem:       'short',
        omitZeroMinute: false,
      }
    },
    eventTimeFormat: () => {
      return {
        hour:           'numeric',
        minute:         '2-digit',
        meridiem:       'short',
        omitZeroMinute: false,
      }
    },
    columnHeaderFormat: () => {
      return {
        weekday:    'short',
        omitCommas: false
      }
    },
    fullcalendarApi() {
      return this.$refs.fullcalendar.getApi()
    }
  },
  watch: {
    // Timeslots may get updated not only when loading the component
    timeslots(timeslots) { this.refresh(); }
  },
  mounted() {
    this.currentYear = this.moment(this.fullcalendarApi.getDate()).year();
    this.loadCalendarEvents();
  },
  methods: {
    eventClick({ event }) {
      if (event.extendedProps.type === 'busy') {
        this.$emit('busy-click', event.extendedProps.id);
        return;
      }

      if (event.extendedProps.is_proposal) {
        this.$emit('proposal-click', event.extendedProps.proposal_id);
        return;
      }

      if (event.extendedProps.is_presentation) {
        this.$emit('presentation-click', event.extendedProps.presentation_id);
        return;
      }

      if (event.extendedProps.type === 'group') {
        this.$emit('proposals-click', moment(event.start).format('MM-DD-YYYY'));
        return;
      }
    },
    addEvent(timeslot) {
      this.calendarEvents.push(this.formatEventFromTimeslot(timeslot))
    },
    removeEvent(eventId) {
      this.fullcalendarApi.getEventById(eventId).remove()
    },
    removeEventFromTimeslot(timeslotId) {
      const event = this.$array.find(this.fullcalendarApi.getEvents(), (event) => {
        return event.extendedProps.id === timeslotId
      })

      event.remove()
    },
    eventResize({ event, endDelta, startDelta }) {
      // this.$emit('selected', this.formatTimeslotFromEvent(newTimeslot))
    },
    datesDestroy() {
      // This method is called right after every view switch on calendar,
      // when we switch years, append new events data
      if (this.moment(this.fullcalendarApi.getDate()).year() !== this.currentYear) {
        this.$emit('reload-events', this.currentYear)
        this.currentYear = this.moment(this.fullcalendarApi.getDate()).year()
      }
    },
    selected(selection) {
      if (!this.ownerMode && this.isDatePast(selection.start) && this.futureOnly) {
        this.$toast.error('Selecione uma data futura');
        return;
      }

      // do nothing if it's a busy day - don't allow actions here
      if (this.isBusyDay(selection.start) && !this.ownerMode) {
        this.$toast.error('O artista não está disponível nesta data');
        return;
      }

      if (!this.$utils.empty(this.max) && this.availableTimeslots.length + 1 > this.max) {
        this.$toast.error(`Não pode adicionar mais do que ${this.max} opções`);
        return;
      }

      if (this.weekMode && selection.allDay) {
        this.fullcalendarApi.changeView('timeGridWeek', selection.start);
        return;
      }

      this.$emit('selected', this.formatTimeslotFromEvent(selection))
    },
    dateClick(day) {
      this.$emit('date-click', day)
    },
    loadCalendarEvents() {
      const nonProposalTimeslots = [...this.timeslotsByType.presentations, ...this.timeslotsByType.busy];

      // Convert provided timeslots into full-calender format
      this.$array.forEach(nonProposalTimeslots, (timeslot) => {
        if (this.$empty(timeslot)) { return; }

        this.calendarEvents.push(this.formatEventFromTimeslot(timeslot, this.isUnavailable(timeslot)));        
      });

      const proposalTimeslotsByDate = this.$array.groupBy(this.timeslotsByType.proposals, (timeslot) => moment(timeslot.start_dt).format('MM-DD-YYYY'));
      this.$array.forEach(proposalTimeslotsByDate, (timeslots, index) => {
        this.calendarEvents.push(this.formatGroupedEventFromTimeslot(index, timeslots))
      });

    },
    formatEventFromTimeslot(timeslot, isAllDay) {
      let startDt = moment(timeslot.start_dt).toISOString();
      let endDt   = moment(timeslot.end_dt).toISOString();

      const fullcalendarEvent = {
        id:             `${timeslot.status}_${timeslot.id}`,
        title:          timeslot.label,
        start:          startDt,
        end:            endDt,
        allDay:         isAllDay,
        extendedProps:  timeslot
      }

      const classes = ['event', timeslot.status];
      if (!this.ownerMode) { classes.push('proposing'); }

      fullcalendarEvent.classNames = classes;      
      return fullcalendarEvent;
    },
    formatGroupedEventFromTimeslot(startDt, timeslots) {
      if (timeslots == null || timeslots.length == 0) { return {}}

      let start = moment(startDt, 'MM-DD-YYYY');
      const earliest = this.$array.min(this.$array.map(timeslots, 'start_dt'));
      const latest   = this.$array.max(this.$array.map(timeslots, 'end_dt'));
      return {
        id:         `grouped_proposals_for_${start.unix().toString()}`,
        title:      `${timeslots.length} ${this.$utils.pluralize('proposta', timeslots.length)}`,
        start:      moment(earliest).toISOString(),
        end:        moment(latest).toISOString(),
        allDay:     false,
        classNames: ['event', 'group', 'proposal'],
        extendedProps: { type: 'group' }
      }
    },
    formatTimeslotFromEvent(event) {
      return new Timeslot({
        start_dt: moment(event.start).toISOString(),
        end_dt:   moment(event.end).toISOString(),
        full_day: event.allDay
      })
    },
    refresh() {
      this.calendarEvents = [];
      this.loadCalendarEvents();
    },
    isBusyDay(date) {
      return this.busyDates.some((busyDate) => moment(date).isSame(moment(busyDate), 'day'));
    },
    isDatePast(date) {
      return this.moment(date).isBefore(this.moment());
    },
    isUnavailable(timeslot) {
      return ['busy', 'accepted'].includes(timeslot.status) && !this.ownerMode;
    }
  }
}
</script>

<style lang="scss">
.event {
  border:           none;
  box-shadow:       $lightShadow;
  border-radius:    5px;
  padding:          5px;
  background-clip:  none;

  span {
    font-size: $small;
  }

  // Make events fill 100% of container
  margin-right: 5px;
  margin-bottom: 5px;
  left: 0% !important;
  right: 0% !important;
  &.proposal {
    background: $proposalTimeslot;
    .fc-title {
      color: $layer2;
    }
  }

  &.proposing {
    background: $proposalTimeslot;
    span {
      color: $layer2;
    }

    &:hover {
      transition: $transition;
      background: $error;
      color:      $brand;
      span {
        color:    $brand;
      }

      &::before {
        display:    block;
        font-size:  $small;
        color:      $brand;
        content:    'Remover';
      }
    }
  }

  &.accepted {
    background: $presentationTimeslot;
  }

  &.blank {
    background: $layer3;
    color: $layer3;
  }

  &.group {
    .fc-time  { display: none; }
    &::before { display: none; content: ''; }
  }

  &.busy {
    transition: $transition;
    background: $layer3;

    span      { color: $layer5; }
    .fc-time  { display: none; }
    &::before { display: none; content: '';
    }

    &:hover {
      transition: $transition;
      background: $error;
      color:      $brand;

      &:not(.fc-time-grid-event) {
        display:  flex;
      }      

      span { color: $brand; }

      &::before {
        display:      block;
        font-size:    $small;
        color:        $white;
        content:      'Remover';
        margin-right: 5px;
      }
    }
  }
}

.fc-time {
  color: $layer1;
}

// for "busy" events
.fc-bgevent {
  background: $layer2;  
  opacity:    0.8;
  cursor:     default;
  z-index:    $moveToTop;

  &::before {
    @extend .horizontal, .center, .middle;
    color:       $error;
    width:       100%;
    height:      100%;    
    font-weight: $bold;
    content:     'Indisponível';
  }
}

.fc-day-top {
  position: relative;
  z-index: $base;
}

// Overwrite buttons
.fc-button, .fc-button-primary {
  background: $layer5;
  border: none;
  transition: $transition;  

  &.fc-button-active {
    background: $brandLayer !important;
  }

  &:disabled {
    background: transparentize($brandLayer, 0.5);
  }

  &:hover {
    transition: $transition;
    background: $brandLayer;
  }
}

.fc-day-grid-event {
  position: relative;
}

span.remove-event {
  @extend .vertical, .center, .middle;
  position:       absolute;
  top:            -5px;
  right:          -10px;
  padding:        5px;
  width:          10px;
  height:         10px;
  border-radius:  $rounded;
  color:          $brand !important;
  font-size:      $large;
  font-weight:    $bold;
  box-shadow:     $shadow;
  background:     $layer5;
  z-index:        $moveToTop;
}

// Full calendar overrides
td {
  cursor: pointer;
}

.fc-view-container {
  background:     $layer3;
  box-shadow:     $higherShadow;
  border-radius:  5px;
  padding:        10px;
  margin-bottom:  3 * $space;
}

.fc-unthemed {
  .fc-content,
  .fc-divider,
  .fc-list-heading,
  .fc-list-heading td,
  .fc-list-view,
  .fc-popover,
  .fc-row,
  .fc-today,
  .fc-widget-header,
  .fc-axis,
  tbody,
  thead,
  th,
  tr,
  td {
    border:     none;
    box-shadow: none;
  }
}

th.fc-axis,
.fc-axis.fc-time {
  color:        $brand;
  font-weight:  $bold;
}

.fc-time-grid .fc-slats {
  border: none;
}

.fc-time-grid .fc-slats .fc-minor td {
  border: none;
}

td:not(.fc-minor) {
  border-top: 0.5px solid rgba(100, 100, 100, 0.2);
}

.fc {
  .fc-day-header,
  td {
    &.fc-today {
      background: rgb(65, 65, 65);
      border: none;
    }
  }
}

.fc-day.fc-disabled-day {
  background: $layer2;
  cursor: default;
}

.fc-toolbar {
  @include mobile {
    flex-direction: column;
  }

  h2 {
    text-transform: capitalize;
  }

  div {
    margin-bottom: $space;
  }

  // .fc-center {
  //   @include mobile {
  //     display: none;
  //   }
  // }
}
</style>
