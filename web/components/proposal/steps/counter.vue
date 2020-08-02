<template>
  <div class="full-width">
    <div v-if="!$utils.empty(steps)" class="full-width horizontal center middle">
      <div v-for="(data, step) in steps" :key="step" class="horizontal middle center">
        <font-awesome
          :icon="icons[step]"
          :class="{ completed: isStepCompleted(step), current: isCurrentStep(step) }"
          @click="goToStep(step)"
        ></font-awesome>
        <div class="progress" v-if="!isLastStep(step)" :class="{ completed: isStepCompleted(step), current: isCurrentStep(step) }"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    steps: { type: Number, default: 0 },
    completed: { type: Array, default: () => {} },
    current: { type: Number, default: 0 }
  },
  data() {
    return {
      icons: ['calendar-alt', 'shopping-cart', 'coffee', 'guitar']
    }
  },  
  methods: {
    isStepCompleted(step) {
      return this.completed.includes(step)
    },
    isCurrentStep(step) {
      return step === this.current
    },
    goToStep(step) {
      this.$emit('goto', step)
    },
    isLastStep(step) {      
      return (this.steps - 1) === step
    }
  }
}
</script>

<style lang="scss" scoped>
[data-icon] {
  @include desktop {
    margin-right: 0;
  }

  @include mobile {
    margin-right: 4 * $space;
  }

  height: 100%;
  transition: $transition;
  color: $layer5;
  font-size: $huge;
  cursor: pointer;
  padding-bottom: $space;

  &.completed {
    transition: $transition;
    color: $brand;
  }

  &.current {
    transition: $transition;
    border-bottom: solid 4px $brand;
  }
}

.progress {
  @include desktop {
    transition: $transition;
    background: $layer5;
    border-radius: 0;
    height: 5px;
    min-width: 100px;
    margin-left: 2 * $space;
    margin-right: 2 * $space;

    &.completed {
      transition: $transition;
      background: $brand;
      // border-bottom: solid 4px $brand;
    }
  }
}
</style>
