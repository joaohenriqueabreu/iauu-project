<template>
  <div>
    <h6 class="mb-4">Escolha uma opção de data e  horário para a apresentação:</h6>
    <carousel class="horizontal center middle">
      <slide
        v-for="(timeslot, index) in timeslots"
        :key="index"
        class="timeslot"
        :class="{ selected: !$empty(selectedTimeslot) && selectedTimeslot.start_dt === timeslot.start_dt }"
      >
        <div @click="select(timeslot)">
          <div class="horizontal mb-2">
            <font-awesome icon="play-circle" class="mr-2"></font-awesome>
            <h6>{{ timeslot.start_dt | datetime }}</h6>
          </div>
          <div class="horizontal">
            <font-awesome icon="stop-circle" class="mr-2"></font-awesome>
            <h6>{{ timeslot.end_dt | datetime }}</h6>
          </div>
        </div>
      </slide>
    </carousel>
  </div>
</template>

<script>
export default {
  props: {
    default: { type: Object, default: () => {} },
    timeslots: { type: Array, default: () => {} }
  },
  data() {
    return {
      selectedTimeslot: null
    }
  },
  mounted() {
    if (!this.$empty(this.default)) {
      this.selectedTimeslot = this.default
    }
  },
  methods: {
    select(timeslot) {
      this.selectedTimeslot = timeslot
      this.$emit('selected', timeslot)
    }
  }
}
</script>

<style lang="scss" scoped>
.timeslot {
  @extend .vertical, .middle, .clickable;
  padding: 2 * $space;
  margin-right: 2 * $space;
  background: $layer1;
  color: $brand;
  border-radius: $edges;
  transition: $transition;
  border: 2px solid $layer1;
  &:hover {
    transition: $transition;
    background: $brandLayer;
  }

  &.selected {
    border: 2px solid $brandLayer;
    background: $layer4;
  }
}
</style>
