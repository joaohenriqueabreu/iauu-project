<template>
  <div class="range">
    <label :for="name">{{ label }}</label>
    <div class="horizontal">
      <b>{{ min | applyFilter(this) }}</b>
      <range-slider
        v-model="selected"
        class="slider"
        :min="min"
        :max="max"
        :step="step"
        @change="$emit('input', selected)"
      >
        <template v-slot:knob>
          <div class="knob-content">{{ selected | number('0,0.0') }}</div>
        </template>
      </range-slider>
      <b>{{ max | applyFilter(this) }}</b>
    </div>
  </div>
</template>

<script>
import RangeSlider from 'vue-range-slider'
import Input from '@/components/form/input'
export default {
  components: {
    'range-slider': RangeSlider
  },
  filters: {
    applyFilter(value, self) {
      return self.$options.filters[self.filterName](value)
    }
  },
  extends: Input,
  props: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 10000 },
    step: { type: Number, default: 100 },
    filterName: { type: String, default: '' }
  },
  data() {
    return {
      selected: 500
    }
  },
  computed: {
    type() {
      return 'range'
    }
  }
}
</script>

<style lang="scss">
@import '~vue-range-slider/dist/vue-range-slider.scss';
.range-slider-fill {
  background-color: $layer5;
}

.range-slider-rail {
  background-color: $layer1;
}
</style>

<style lang="scss" scoped>
.range {
  @extend .vertical, .middle, .center;
  .knob-content {
    position: absolute;
    top: 20px;
    left: -10px;
    font-weight: $bold;
  }
}
</style>
