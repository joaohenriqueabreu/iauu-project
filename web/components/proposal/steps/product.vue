<template>
  <div>
    <div class="mb-5 vertical">
      <h6 class="mb-2">Escolha o formato de apresentação que você deseja contratar</h6>
    </div>
    <carousel class="full-height mb-4 row" :navigation-enabled="true">
      <slide v-for="(product, index) in products" :key="index" class="mb-2 col-6">
        <overlay>
          <template v-slot:default>
            <div :class="{ selected: product === selectedProduct }">
              <product-manager :ref="`info_${product.id}`" :product="product" read-only @selected="chooseProduct(product)"></product-manager>
            </div>
          </template>
          <template v-slot:hover>
            <div class="full-height vertical middle center">
              <h3 class="mb-5" @click="chooseProduct(product)">
                <icon icon="hand-rock-n-roll"></icon>
                Escolher formato
              </h3>
              <form-button @action="openPreviewModal(product)">Ver mais informações</form-button>
            </div>
          </template>
        </overlay>
      </slide>
    </carousel>
    <div v-if="$empty(proposal.product)" class="clickable brand-hover">
      <h4 @click="openCustomProductModal">
        <u>Ou clique aqui personalize sua apresentação.</u>
      </h4>
    </div>
    <!-- TOOD investigate why is overflowing -->
    <div v-else class="half-width mt-5">
      <div class="boxed border mx-5">
        <div class="top-right pt-3 brand-hover clickable" @click="unselectProduct">
          <icon icon="times"></icon>
        </div>
        <h4 class="mb-4">Produto selecionado</h4>
        <h6 class="mb-4">{{ productName }}</h6>
        <div v-if="!isCustomProduct">
          <div class="horizontal middle center my-4 d-flex justify-content-between">
            <div>
              <h4>{{ proposal.product.price | currency }}</h4>
            </div>
            <div>
              <h4 class="horizontal">
                <icon icon="clock" class="mr-"></icon>{{ proposal.product.duration }} horas
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
    <product-preview ref="preview" proposal :artist="proposal.artist" @selected="chooseProduct"></product-preview>
    <custom-product ref="custom" :artist="proposal.artist" @selected="chooseProduct"></custom-product>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import Step                     from '@/components/proposal/steps/step';
import ProductManager              from '@/components/artist/product/manager';
import ProductPreview           from '@/components/artist/product/preview';
import CustomProduct            from '@/components/proposal/steps/customProduct';
export default {
  components: {
    ProductManager,
    ProductPreview,
    CustomProduct
  },
  extends: Step,
  props: {
    products: { type: Array, default: () => {} }
  },
  data() {
    return {
      customItems: []
    }
  },
  computed: {
    ...mapState({ selectedProduct: (state) => state.proposal.proposal.product }),
    isCustomProduct() {
      return this.proposal.product.name === 'custom';
    },
    productName() {      
      if (this.isCustomProduct) { return 'Personalizado. Valor e duração da apresentação serão negociados com o artista.'; }
      return this.proposal.product.name;
    }
  },
  methods: {
    ...mapActions('proposal', ['editProposal']),
    chooseProduct(product) {
      this.editProposal({prop: 'product', value: product});
      this.$emit('complete');
      this.$emit('next');
    },
    openCustomProductModal() {
      this.$refs.custom.openModal();
    },
    openPreviewModal(product) {
      this.$refs.preview.openModal(product);
    },
    unselectProduct() {
      this.editProposal({ prop: 'product', value: null });
    }
  }
}
</script>

<style lang="scss" scoped>

.selected {
  box-shadow: none !important;
  border:     5px solid $brandLayer;
}

.custom-product {
  @extend .full-height, .vertical, .middle, .center, .clickable;
  background: $layer4;
  box-shadow: $shadow;
}
</style>
