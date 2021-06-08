<template>
  <div>
    <scrollbar>
      <div class="horizontal center mon-year">
        <div v-for="(monYear, index) in oneYearCalendar" :key="index" class="mr-2 vertical center">
          <div class="clickable brand-hover" :class="{ active: monYear == lastMonYear }" @click="selectMonYear(monYear)">{{ monYear }}</div>
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
import { mapState } from 'vuex';
export default {
  data() {
    return {
      lastMonYear: '',
    }
  },
  computed: {
    ...mapState({ timeslots: (state) => state.schedule.timeslots }),
    oneYearCalendar() {
      // iterate thru the next 12 months
      let yearCalendar = [];
      for (let m = 0; m <= 12; m++) {
        yearCalendar.push(this.moment().startOf('month').add(m, 'M').format('MM/YY'));
      }

      return yearCalendar;
    },
    timeslotsByMonth() {
      return this.$array.groupBy(this.timeslots, (timeslot) => {
        return this.moment(timeslot.start_dt).format('MM/YY')
      });
    }
  },
  methods: {
    hasProposal(index) {
      if (this.timeslotsByMonth[index] === undefined) { return false; }
      return this.$array.filter(this.timeslotsByMonth[index], (timeslot) => timeslot.status === 'proposal').length > 0;
    },
    hasPresentation(index) { 
      if (this.timeslotsByMonth[index] === undefined) { return false; }
      return this.$array.filter(this.timeslotsByMonth[index], (timeslot) => timeslot.status === 'accepted').length > 0;
    },
    selectMonYear(monYear) {
      console.log(monYear)
      this.$emit('selected', monYear);
      this.lastMonYear = monYear;
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
  // transition:   $transition;
  color:        $layer5;
  font-weight:  $bold;
  min-height:   40px;
  // &:hover {
  //   transition: $transition;
  //   color:      $brandLayer;
  // }
  .active {
    color: $brandLayer;
  }
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
