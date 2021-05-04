<template>
  <div class="vertical center middle mx-4">    
    <h5 class="mb-4">
      Produto selecionado <u @click="openPreviewModal" class="clickable brand-hover">{{ selectedProduct }}</u>
    </h5>
    <div class="items" v-if="!$empty(presentation.product.items)">
      <h6 class="mb-4">
        Itens <span v-if="presentation.status === 'proposal'">solicitados</span><span v-else>contratados</span>
      </h6>
      <div v-for="(item, index) in presentation.product.items" :key="index">
        <div class="horizontal"><icon icon="check"></icon>{{ item }}</div>
        <hr v-if="index < presentation.product.items.length - 1" />
      </div>
    </div>
    <product-preview read-only :artist="presentation.artist" ref="preview"></product-preview>
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
