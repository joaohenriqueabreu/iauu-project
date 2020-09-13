<template>
  <div>
    <div v-if="!$empty(feedback.notes)">
      <div class="testemonial">
        <h6 class="mb-2">{{ feedback.from.name }}</h6>
        <div class="horizontal mb-4">
          <h6 class="mr-2">{{ feedback.rating }}</h6>
          <font-awesome icon="star"></font-awesome>
        </div>
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
  margin: 2 * $space 0 2 * $space 4 * $space;
  padding: 3 * $space;
  box-shadow: $shadow;
  border-top-right-radius: $extraEdges;
  border-bottom-right-radius: $extraEdges;
  border-bottom-left-radius: $extraEdges;
  @include desktop {
    min-width: 200px;
  }

  @include mobile {
    width: 90%;
  }

}
</style>