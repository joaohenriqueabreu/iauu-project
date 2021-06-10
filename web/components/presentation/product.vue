<template>
  <div class="vertical center middle mx-4">    
    <h5 class="mb-4">
      Produto selecionado <u @click="openPreviewModal" class="clickable brand-hover">{{ selectedProduct }}</u>
    </h5>
    <div class="horizontal one-line mb-4" v-if="!$empty(presentation.product.items)">      
      <icon icon="check"></icon>Itens 
      <span v-if="presentation.status === 'proposal'" class="mx-2">solicitados</span><span v-else class="mx-2">contratados</span>
      <span v-for="(item, index) in presentation.product.items" :key="index" class="mr-2">
        <b>{{ item }}</b>,
      </span>
    </div>
    <product-preview :artist="presentation.artist" ref="preview"></product-preview>
  </div>
</template>

<script>
import ProductPreview from '@/components/artist/product/preview';
export default {
  components: {
    ProductPreview,
  },
  props: {
    presentation: { type: Object, default: () => {} },
    hidePrice:    { type: Boolean, default: false }
  },
  computed: {
    selectedProduct() {
      return this.isCustomProduct ? 'Personalizado' : this.presentation.product.name;
    },
    isCustomProduct() {
      if (this.presentation.product == null) { return false; }
      return this.presentation.product.custom || this.presentation.product.name === 'custom';
    }
  },
  methods: {
    openPreviewModal() {
      this.$refs.preview.openModal(this.presentation.product, this.presentation.artist.products);
    }
  }
}
</script>

<style lang="scss" scoped>
.ps {
  max-height: 20vh;
}

.items {
  padding:        2 * $space;
  // border-radius:  $edges;
  width:          100%;
  background:     transparent;
  // border:         2px solid $layer5;
}
</style>
