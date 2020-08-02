<template>
  <div>
    <div v-if="!readOnly">
      <font-awesome v-for="star in MAX_RATE" :key="star" @click="rate(star)" :icon="selectedStar(star)" class="clickable">
      </font-awesome>
    </div>
    <div v-else>
      <div v-if="short">
        <div v-if="score > 0">
          <font-awesome class="icon mr-1" icon="star"></font-awesome>
          <small class="bold">{{ score | oneDecimal }}</small>
        </div>
      </div>
      <div v-else class="horizontal center middle">
        <div v-if="filledStars > 0">
          <font-awesome v-for="star in filledStars" :key="star" class="icon" icon="star">
          </font-awesome>
        </div>
        <div v-if="halfStar">
          <font-awesome class="icon" icon="star-half-alt"></font-awesome>
        </div>
        <div v-if="noStar > 0">
          <font-awesome v-for="star in noStar" :key="`-${star}`" class="icon" :icon="['far', 'star']">
          </font-awesome>
        </div>
        <div v-if="amount > 0">
          <small>({{ amount }})</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    score: { type: Number, default: 1 },
    amount: { type: Number, default: 0 },
    short: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: true },
  },
  data() {
    return {
      value: 0,
      hoverValue: 0,
      MAX_RATE: 5
    }
  },
  mounted() {
    this.value = this.score
  },
  computed: {
    filledStars() {
      if (this.readOnly) {
        return Math.floor(this.score)
      } else {
        return this.value
      }
    },
    halfStar() {
      return Math.round(this.score) > this.filledStars
    },
    noStar() {
      return this.MAX_RATE - (this.filledStars + this.halfStar)
    }
  },
  methods: {
    selectedStar(star) {
      if (star <= this.value) {
        return 'star'
      }

      return ['far', 'star']
    },
    rate(rating) {
      if (this.readOnly) { return }

      this.value = rating
      this.$emit('rated', this.value)
    }
  }
}
</script>

<style></style>
