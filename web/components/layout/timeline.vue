<template>
  <div class="full-width">
    <div v-if="!$utils.empty(steps)" class="full-width horizontal center middle">
      <div v-for="(data, step) in steps" :key="step" class="horizontal middle center">
        <icon :icon="stepIcons[step]" :class="{ completed: isStepCompleted(step), current: isCurrentStep(step) }" @click="goToStep(step)" :title="labels[step]"></icon>
        <div v-if="!isLastStep(step)" class="progress" :class="{ completed: isStepCompleted(step), current: isCurrentStep(step) }"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    steps: { type: Number, default: 0 },
    completed: { type: Array, default: () => {} },
    current: { type: Number, default: 0 },
    icons: { type: Array, default: () => {}},
    readOnly: { type: Boolean, default: false },
    labels: { type: Array, default: () => {}}
  },
  data() {
    return {
      defaultIcons: ['calendar-alt', 'shopping-cart', 'coffee', 'guitar']
    }
  },
  computed: {
    stepIcons() {
      return this.$empty(this.icons) ? this.defaultIcons : this.icons;
    }
  },
  methods: {
    isStepCompleted(step) {
      return this.completed.includes(step);
    },
    isCurrentStep(step) {
      return step === this.current;
    },
    goToStep(step) {
      if (this.readOnly) { return; }
      this.$emit('goto', step);
    },
    isLastStep(step) {
      return this.steps - 1 === step;
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
