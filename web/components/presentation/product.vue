<template>
  <div class="vertical center middle mx-4">
    <h5 class="mb-4">Produto selecionado <u>{{ selectedProduct }}</u></h5>
    <div v-if="!isCustomProduct && !hidePrice" class="horizontal center middle mb-4">
      <h3>{{ presentation.proposal.product.price | currency }} para {{ presentation.proposal.product.duration }} horas de apresentação</h3>
    </div>
    <div class="items">
      <h6 class="mb-4">Itens <span v-if="presentation.status === 'proposal'">solicitados</span><span v-else>contratados</span></h6>
      <perfect-scrollbar>
        <div v-for="(item, index) in presentation.proposal.product.items" :key="index">
          {{ item }}
          <hr>
        </div>
      </perfect-scrollbar>
    </div>
  </div>  
</template>

<script>
export default {
  props: {
    presentation: { type: Object, default: () => {}},
    hidePrice: { type: Boolean, default: false }
  },
  computed: {
    selectedProduct() {
      return this.isCustomProduct ? 'Personalizado' : this.presentation.proposal.product.name
    },
    isCustomProduct() {
      return this.presentation.proposal.product.custom || this.presentation.proposal.product.name === 'custom'
    },
  }
}
</script>

<style lang="scss" scoped>
.ps {
  max-height: 20vh;
}

.items {
  padding: 2 * $space;
  border-radius: $edges;
  width: 100%;
  background: $layer1;
}
</style>