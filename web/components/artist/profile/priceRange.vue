<template>
  <div>
    <div class="horizontal">
      <div class="mr-4" v-if="short">
        <h4>
          <font-awesome v-for="index in range" :key="`active_${index}`" icon="dollar-sign" class="price-range active mr-1"></font-awesome>
          <font-awesome v-for="index in 5 - range" :key="`inactive_${index} `" icon="dollar-sign" class="price-range inactive mr-1"></font-awesome>
        </h4>
      </div>
      <h4 v-if="!short">{{ $config.priceRanges[range] }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    short: { type: Boolean, default: false },
    range: { type: Number, default: 1 }
  }
}
</script>

<style lang="scss" scoped>
.price-range {
  color: $brand;
  &.inactive {
    color: $layer5;
  }
}
</style>