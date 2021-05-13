<template>
  <div>
    <div v-if="!$empty(feedback.notes)">
      <div class="testemonial position-relative">
        <div class="horizontal middle my-3 top-right">
          <h5 class="mr-2">{{ feedback.rating }}</h5>
          <icon icon="star"></icon>
        </div>
        <h6 class="mb-4">{{ feedback.from.name }}</h6>        
        <i>{{ feedback.notes }}</i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    feedback: {}
  }
}
</script>

<style lang="scss" scoped>
.testemonial {
  background: $layer3;
  margin:     2 * $space 0 2 * $space 4 * $space;
  padding:    3 * $space;
  box-shadow: $shadow;
  border-top-right-radius: $extraEdges;
  border-bottom-right-radius: $extraEdges;
  border-bottom-left-radius: $extraEdges;
  @include desktop {
    min-width: 200px;
    max-width: 50%;
  }

  @include mobile {
    width: 90%;
  }

}
</style>