<template>
  <div>
    <h5 class="mb-3">Histórico da Negociação</h5>
    <div>
      <div v-for="(rejectedOffer, index) in proposal.rejected_counter_offers" :key="index">
        <div class="horizontal middle mb-4">
          <icon icon="times" class="mr-3 color-layer-5"></icon>
          <b class="mr-3 color-layer-5">[{{ rejectedOffer.updated_at | date }}]</b>
          <h6>{{ rejectedOffer.price | currency }} para {{ rejectedOffer.duration }} horas</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    proposal: {}
  }
}
</script>

<style>

</style>