<template>
  <div class="full-width">
    <div v-if="!$utils.empty(steps)" class="full-width horizontal center middle">
      <div v-for="(data, step) in steps" :key="step" class="horizontal middle center">
        <div class="step" :class="{ completed: isStepCompleted(step), current: isCurrentStep(step) }">
          <icon :icon="stepIcons[step]" @click="goToStep(step)" :title="labels[step]"></icon>
        </div>
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
@mixin hover() {
  &:hover {
    color: $brand2;
    border-color: $brand2;
  }
}
.step {
  @include hover();
  height: 50px;
  width: 50px;
  text-align: center;
  transition: $transition;
  color: $layer5;
  font-size: $huge;
  cursor: pointer;
  padding-bottom: $space;
  border-radius: $rounded;
  border-color: $layer5;
  border: solid 4px $layer5;
  padding: $space;

  [data-icon] {
    @include hover();
    margin: $space;
  }

  @include desktop {
    margin-right: 0;
  }

  @include mobile {
    margin-right: 15px;
  }
  
  &.completed, &.current {
    @include hover();
    transition: $transition;
    color: $brand;
    border-color: $white;
    [data-icon] {
      @include hover();
      color: $brand;
    }
  }
}
.progress {
  @include desktop {
    @include hover();
    transition: $transition;
    background: $layer5;
    border-radius: 0;
    height: 5px;
    min-width: 100px;
    // margin-left: 2 * $space;
    // margin-right: 2 * $space;
    &.completed {
      @include hover();
      transition: $transition;
      background: $brand;
      // border-bottom: solid 4px $brand;
    }
  }
}
</style>