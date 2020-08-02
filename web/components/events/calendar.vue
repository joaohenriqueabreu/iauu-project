<template>
  <div>
    <FullCalendar
      ref="fullcalendar"
      default-view="dayGridMonth"
      :nav-links="weekMode"
      nav-link-day-click="timeGridWeek"
      :events="calendarEvents"
      theme="bootstrap"
      locale="pt-br"
      :plugins="calendarPlugins"
      content-height="auto"
      height="parent"
      width="parent"
      :aspect-ratio="0.5"
      :select-long-press-delay="250"
      slot-duration="01:00:00"
      slot-label-interval="04:00:00"
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
// import { mapActions } from 'vuex'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import moment from 'moment'
import Timeslot from '@/models/timeslot'

export default {
  components: {
    FullCalendar
  },
  props: {
    readOnly: { type: Boolean, default: true },
    weekMode: { type: Boolean, default: false },
    timeslots: { type: Array, default: () => {} },
    ownerMode: { type: Boolean, default: false },
    max: { type: Number, default: null },
    futureOnly: { type: Boolean, default: true }
  },
  data() {
    return {
      calendarPlugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, bootstrapPlugin],
      calendarEvents: [],
      currentYear: 0 // store to fetch new events when user switches year
    }
  },
  computed: {
    defaultView() {
      return this.weekMode ? 'timeGridWeek' : 'dayGridMonth'
    },
    busyDates() {
      const self = this
      const busyTimeslots = this.$collection.filter(
        this.timeslots,
        (timeslot) => !self.$empty(timeslot) && self.isUnavailable(timeslot)
      )

      return this.$collection.map(busyTimeslots, 'start_dt')
    },
    unavailableTimeslots() {
      const self = this
      return this.$collection.filter(this.timeslots, (timeslot) => !self.$empty(timeslot) && self.isUnavailable(timeslot))
    },
    availableTimeslots() {
      const self = this
      return this.$collection.filter(this.timeslots, (timeslot) => !self.$empty(timeslot) && !self.isUnavailable(timeslot))
    },
    headerButtons: () => {
      return {
        left: 'title',
        center: 'timeGridWeek, dayGridMonth',
        right: 'today, prev, next, nextYear'
      }
    },
    buttonText: () => {
      return {
        today: 'Hoje',
        month: 'Mês',
        week: 'Semana',
        day: 'Dia',
        timeWeekGrid: 'Ver semana'
      }
    },
    titleFormat: () => {
      return {}
    },
    slotLabelFormat: () => {
      return {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        meridiem: 'short'
      }
    },
    eventTimeFormat: () => {
      return {
        hour: 'numeric',
        minute: '2-digit',
        omitZeroMinute: false,
        meridiem: 'short'
      }
    },
    columnHeaderFormat: () => {
      return {
        weekday: 'short',
        month: 'numeric',
        day: 'numeric',
        omitCommas: 'false'
      }
    },
    fullcalendarApi() {
      return this.$refs.fullcalendar.getApi()
    }
  },
  watch: {
    // Timeslots may get updated not only when loading the component
    timeslots(timeslots) {
      this.refresh()
    }
  },
  mounted() {
    this.currentYear = this.moment(this.fullcalendarApi.getDate()).year()
    this.loadCalendarEvents()
  },
  methods: {
    eventClick({ event }) {
      this.$emit('event-click', {
        eventId: event.id,
        timeslotId: event.extendedProps.id,
        proposalId: event.extendedProps.proposal_id,
        presentationId: event.extendedProps.presentation_id,
        type: event.extendedProps.type,
        status: event.extendedProps.status
      })
    },
    addEvent(timeslot) {
      this.calendarEvents.push(this.formatEventFromTimeslot(timeslot))
    },
    removeEvent(eventId) {
      this.fullcalendarApi.getEventById(eventId).remove()
    },
    removeEventFromTimeslot(timeslotId) {
      const event = this.$collection.find(this.fullcalendarApi.getEvents(), (event) => {
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
      if (this.isDatePast(selection.start) && this.futureOnly) {
        this.$toast.error('Selecione uma data futura')
        return
      }

      // do nothing if it's a busy day - don't allow actions here
      if (this.isBusyDay(selection.start) && !this.ownerMode) {
        this.$toast.error('O artista não está disponível nesta data')
        return
      }

      if (!this.$utils.empty(this.max) && this.availableTimeslots.length + 1 > this.max) {
        this.$toast.error(`Não pode adicionar mais do que ${this.max} opções`)
        return
      }

      if (this.weekMode && selection.allDay) {
        this.fullcalendarApi.changeView('timeGridWeek', selection.start)
        return
      }

      this.$emit('selected', this.formatTimeslotFromEvent(selection))
    },
    dateClick(day) {
      this.$emit('date-click', day)
    },
    formatEventFromTimeslot(timeslot, isBackground) {
      let startDt = moment(timeslot.start_dt).toISOString()
      const endDt = moment(timeslot.end_dt).toISOString()

      // According to viewer and timeslot status setup event status to change its display
      const eventStatus = isBackground ? 'unavailable' : timeslot.status

      if (isBackground) {
        startDt = moment(timeslot.start_dt)
          .startOf('day')
          .toISOString()
      }

      const fullcalendarEvent = {
        id: `${timeslot.status}_${timeslot.id}`,
        title: isBackground ? 'Indisponível' : timeslot.label,
        start: startDt,
        end: endDt,
        allDay: isBackground,
        extendedProps: timeslot
      }

      if (isBackground) {
        fullcalendarEvent.rendering = 'background'
      } else {
        const classes = ['event', eventStatus]
        if (!this.ownerMode) {
          classes.push('proposing')
        }

        fullcalendarEvent.classNames = classes
      }

      return fullcalendarEvent
    },
    formatTimeslotFromEvent(event) {
      return new Timeslot({
        start_dt: moment(event.start).toISOString(),
        end_dt: moment(event.end).toISOString(),
        full_day: event.allDay
      })
    },
    loadCalendarEvents() {
      // Convert provided timeslots into full-calender format
      this.timeslots.forEach((timeslot) => {
        if (!this.$empty(timeslot)) {
          this.calendarEvents.push(this.formatEventFromTimeslot(timeslot, this.isUnavailable(timeslot)))
        }
      })
    },
    refresh() {
      // TODO think about a way of triggering reactivity without having to reload
      this.calendarEvents = []
      this.loadCalendarEvents()
    },
    isBusyDay(date) {
      return this.busyDates.some((busyDate) => moment(date).isSame(moment(busyDate), 'day'))
    },
    isDatePast(date) {
      return this.moment(date).isBefore(this.moment())
    },
    isUnavailable(timeslot) {
      return ['busy', 'accepted'].includes(timeslot.status) && !this.ownerMode
    }
  }
}
</script>

<style lang="scss">
.event {
  border: none;
  box-shadow: $lightShadow;
  border-radius: 5px;
  padding: 5px;
  background-clip: none;

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
      background: red;
      span {
        color: $brand;
      }

      &::before {
        display: block;
        font-size: $small;
        color: $brand;
        content: 'Remover';
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

  &.busy {
    transition: $transition;
    background: transparent;
    span {
      color: $layer5;
    }

    .fc-time {
      display: none;
    }

    &::before {
      display: none;
      content: '';
    }

    &:hover {
      transition: $transition;
      background: red;
      span {
        color: $brand;
      }

      &::before {
        display: block;
        font-size: $small;
        color: $white;
        content: 'Remover';
      }
    }
  }
}

.fc-time {
  color: $layer1;
}

// for "busy" events
.fc-bgevent {
  background: $layer1;
  position: relative;
  opacity: 0.8;
  cursor: default;
  z-index: $moveToTop;
  &::before {
    @extend .horizontal, .center, .middle;
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    // position: absolute;
    // left: 45%;
    // top: 20%;
    color: $layer5;
    padding: $space;
    // padding-top: -10px;

    // font-family: FontAwesome;
    // font-weight: 900;
    // font-size: 20px;
    // content: '\f057'; // circle-times
    // content: '\f00d'; // times
    content: 'Indisponível';
  }
}

.fc-day-top {
  position: relative;
  z-index: $base;
}

// Overwrite buttons
.fc-button,
fc-button-primary {
  background: $brandLayer;
  border: none;
  transition: $transition;

  &:disabled {
    background: transparentize($brandLayer, 0.5);
  }

  &:hover {
    transition: $transition;
  }
}

.fc-day-grid-event {
  position: relative;
}

span.remove-event {
  @extend .vertical, .center, .middle;
  position: absolute;
  top: -5px;
  right: -10px;
  padding: 5px;
  width: 10px;
  height: 10px;
  border-radius: $rounded;
  color: $brand !important;
  font-size: $large;
  font-weight: $bold;
  box-shadow: $shadow;
  background: $layer5;
  z-index: $moveToTop;
}

// Full calendar overrides
td {
  cursor: pointer;
}

.fc-view-container {
  background: $layer3;
  box-shadow: $higherShadow;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 3 * $space;
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
    border: none;
    box-shadow: none;
  }
}

th.fc-axis,
.fc-axis.fc-time {
  font-weight: $bold;
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
</style>
