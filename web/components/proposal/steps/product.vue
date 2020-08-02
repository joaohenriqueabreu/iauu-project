<template>
  <div>
    <div class="mb-5 vertical">
      <h6 class="mb-2">Escolha o produto do artista que você deseja contratar</h6>
    </div>
    <carousel class="full-height" :navigationEnabled="true">
      <slide v-for="(product, index) in products" :key="index" class="mr-5">
        <overlay>
          <template v-slot:default>
            <div :class="{ selected: product === selectedProduct }">
              <product-info
                :ref="`info_${product.id}`"
                :product="product"
                :not-items="notItems(product.items)"
                proposal-view
                @selected="chooseProduct(product)"
              ></product-info>
            </div>
          </template>
          <template v-slot:hover>
            <div class="full-height vertical middle center">
              <h3 class="mb-5" @click="chooseProduct(product)">
                <font-awesome icon="hand-rock-n-roll"></font-awesome>
                Escolher formato
              </h3>
              <form-button @action="openPreviewModal(product)">Ver mais informações</form-button>
            </div>
          </template>
        </overlay>
      </slide>
      <slide>
        <div class="custom-product" @click="openCustomProductModal">
          <h3>Personalize sua apresentação</h3>
        </div>
      </slide>
    </carousel>
    <product-preview ref="preview" @selected="chooseProduct"></product-preview>
    <custom-product ref="custom" :all-items="allItems" @selected="chooseProduct"></custom-product>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Step from '@/components/proposal/steps/step'
import ProductInfo from '@/components/artist/product/info'
import ProductPreview from '@/components/artist/product/preview'
import CustomProduct from '@/components/proposal/steps/customProduct'
export default {
  components: {
    'product-info': ProductInfo,
    'product-preview': ProductPreview,
    'custom-product': CustomProduct
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
    ...mapState({ selectedProduct: (state) => state.contractor.proposal.product }),
    allItems() {
      const allItems = []
      this.products.forEach((product) => {
        allItems.push(product.items)
      })

      return this.$array.uniq(this.$array.flatten(allItems))
    }
  },
  methods: {
    ...mapActions('contractor', ['editProposal']),
    chooseProduct(product) {
      this.editProposal({ prop: 'product', value: product })
      this.$emit('complete')
      this.$emit('next')
    },
    notItems(productItems) {
      return this.$array.difference(this.allItems, productItems)
    },
    openCustomProductModal() {
      this.$refs.custom.openModal()
    },
    openPreviewModal(product) {
      this.$refs.preview.openModal(product, this.notItems(product.items))
    }
  }
}
</script>

<style lang="scss" scoped>
// .product-container {
//   @extend .horizontal;
//   width: 100%;
//   margin-bottom: 4 * $space;
//   background: $layer4;
//   img,
//   .video {
//     height: 100%;
//     width: 50%;
//     padding: 0;

//     iframe {
//       width: 100%;
//       height: 100%;
//     }
//   }

//   div {
//     position: relative;
//     padding: 2 * $space;
//     width: 100%;

//     h5 {
//       position: absolute;
//       bottom: 0;
//       right: 0;
//       padding: 2 * $space;
//     }
//   }

//   cursor: pointer;
//   box-shadow: none;
//   transition: $transition;

//   &:hover {
//     box-shadow: $shadow;
//     transition: $transition;
//   }
//   // margin: 4 * $space;
// }

// .products-container {
//   @include desktop {
//     display: flex;
//     flex-direction: row;
//     // width: 80vw;
//     overflow-y: hidden;
//   }

//   @include mobile {
//     display: flex;
//     flex-direction: column;
//     width: 100%;
//   }
// }

// .custom-product {
//   @extend .clickable;
//   transition: $transition;

//   &:hover {
//     transition: $transition;
//     color: $brandLayer;
//   }
// }

.selected {
  border: 20px solid $brandLayer;
}

.custom-product {
  @extend .full-height, .vertical, .middle, .center, .clickable;
  background: $layer4;
  box-shadow: $shadow;
}
</style>
