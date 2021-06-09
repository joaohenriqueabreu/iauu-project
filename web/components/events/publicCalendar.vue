<script>
import Calendar from '@/components/events/calendar';
export default {
  extends: Calendar,
  methods: {
    loadCalendarEvents() {
      // group proposals by date
      const proposalsByDate = this.$array.groupBy();

      // Convert provided timeslots into full-calender format
      this.timeslots.forEach((timeslot) => {
        if (this.$empty(timeslot)) { continue; }

        let event = {};
        if (timeslot.is_proposal) { 
          // Build proposal per day structure
          this.appendProposalForDay(timeslot);
          continue;
        }
            
        this.calendarEvents.push(this.formatEventFromTimeslot(timeslot, this.isUnavailable(timeslot)));        
      });
    },
    formatEventFromTimeslot(timeslot, isBackground) {
      let startDt = moment(timeslot.start_dt).toISOString();
      let endDt   = moment(timeslot.end_dt).toISOString();

      // According to viewer and timeslot status setup event status to change its display
      const eventStatus = isBackground ? 'unavailable' : timeslot.status;

      if (isBackground) {
        startDt = moment(timeslot.start_dt).startOf('day').toISOString();
      }

      const fullcalendarEvent = {
        id:             `${timeslot.status}_${timeslot.id}`,
        title:          isBackground ? 'Indisponível' : timeslot.label,
        start:          startDt,
        end:            endDt,
        allDay:         isBackground,
        extendedProps:  timeslot
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
  }
}
</script>