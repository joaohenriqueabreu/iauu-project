<template>
  <div>
    <scrollbar>
      <div class="horizontal center mon-year">
        <div v-for="(monYear, index) in oneYearCalendar" :key="index" class="mr-2 vertical center">
          <div class="clickable brandHover" @click="$emit('selected', monYear)">{{ monYear }}</div>
          <div class="horizontal center middle">
            <div v-if="hasProposal(monYear)" class="proposal"></div>
            <div v-if="hasPresentation(monYear)" class="presentation"></div>
          </div>
        </div>
      </div>
    </scrollbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({ timeslots: (state) => state.schedule.timeslots }),
    oneYearCalendar() {
      // iterate thru the next 12 months
      let yearCalendar = []
      for (let m = 0; m <= 12; m++) {
        yearCalendar.push(this.moment().startOf('month').add(m, 'M').format('MM/YY'))
      }

      return yearCalendar
    },
    timeslotsByMonth() {
      return this.$array.groupBy(this.timeslots, (timeslot) => {
        return this.moment(timeslot.start_dt).format('MM/YY')
      })
    }
  },
  methods: {
    hasProposal(index) {
      if (this.timeslotsByMonth[index] === undefined) { return false }
      return this.$array.filter(this.timeslotsByMonth[index], (timeslot) => timeslot.status === 'proposal').length > 0
    },
    hasPresentation(index) { 
      if (this.timeslotsByMonth[index] === undefined) { return false }
      return this.$array.filter(this.timeslotsByMonth[index], (timeslot) => timeslot.status === 'accepted').length > 0
    }
  }
}
</script>

<style lang="scss" scoped>
.ps {
  max-width: 90vw;
  margin: 2 * $space;
}

.mon-year {
  color: $layer5;
  min-height: 40px;
}

.proposal {
  height: 10px;
  width: 10px;
  border-radius: $rounded;
  background: $proposalTimeslot;
  margin-right: $space;
}

.presentation {
  height: 10px;
  width: 10px;
  border-radius: $rounded;
  background: $presentationTimeslot;
  margin-right: $space;
}
</style>
