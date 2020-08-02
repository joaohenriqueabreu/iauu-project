/* eslint-disable */
<template>
  <div>
    <div class="horizontal middle d-flex clickable mb-5" @click="newProduct">
      <h5 class="mr-2">
        <span class="mr-2">Adicione Formatos</span>
        <font-awesome icon="plus"></font-awesome>
      </h5>
    </div>
    <div class="align-items-stretch full-height">
      <carousel :per-page="2" :navigationEnabled="true">
        <slide v-for="(product, index) in products" :key="index">
          <div class="product mr-4">
            <product-info :product="product" :not-items="notItems(product.items)" class="full-height" @edit="editProduct">
            </product-info>
          </div>
          
        </slide>
      </carousel>      
    </div>
    <product-form ref="productForm" @save="save" @remove="removeProduct"></product-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import ProductForm from '@/components/artist/product/form'
import ProductInfo from '@/components/artist/product/info'
export default {
  components: {
    'product-form': ProductForm,
    'product-info': ProductInfo
  },
  async asyncData({ store, app }) {
    await store.dispatch('artist/loadProducts')
  },
  computed: {
    ...mapState({ products: (state) => state.artist.products })
  },
  mounted() {
    const items = []
    this.products.forEach((product) => items.push(product.items))
    this.productItems = this.$array.uniq(this.$array.flatten(items))
  },
  methods: {
    ...mapActions('artist', ['loadProducts', 'saveProduct', 'removeProduct']),
    newProduct() {
      this.$refs.productForm.newProduct()
    },
    editProduct(product) {
      this.$refs.productForm.editProduct(product)
    },
    openItemForm(item) {
      this.$refs.productItem.openModal()
    },
    openConfirmRemove(productId) {
      this.$refs.removeProductDialog.openModal(productId)
    },
    async save(product) {
      await this.saveProduct(product)
      this.$toast.success('Produto salvo')
    },
    async remove(productId) {
      await this.removeProduct(productId)
      this.$nextTick(function() {
        this.$refs.confirm.close()
      })
    },
    notItems(items) {
      // this.$array.uniq(this.$array.flatten(arrs))
      const allItems = []
      this.products.forEach((product) => {
        allItems.push(product.items)
      })

      return this.$array.difference(this.$array.uniq(this.$array.flatten(allItems)), items)
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  td {
    max-width: 20vw;
  }
}

.small {
  font-size: $small;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  white-space: nowrap;
}

button {
  @extend .horizontal, .center, .middle;
  outline: none;
  min-width: 5vh;
  background: $layer3;
  transition: $transition;
  padding: 2 * $space;
  border-radius: $rounded;
  border: none;
  font-weight: $bold;
  box-shadow: $shadow;
  color: $brand;

  &:hover {
    transition: $transition;
    background: $brand;
    color: $layer3;
  }
}

.description {
  max-height: 100px;
  position: relative;
}

.documents {
  @extend .vertical, .middle, .full-width;
  position: relative;
  padding: 2 * $space;
}

.new-product-form {
  max-height: 50vh;
}

.product {
  width: 40vw;
}
</style>
/* eslint-enable */
