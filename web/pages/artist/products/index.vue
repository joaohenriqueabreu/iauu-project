<template>
  <div>
    <div class="horizontal middle d-flex clickable mb-5" @click="newProduct">
      <h5 class="mr-2">
        <span class="mr-2">Adicione Formatos</span>
        <icon icon="plus"></icon>
      </h5>
    </div>
    <div class="align-items-stretch full-height">
      <carousel :per-page="2" :navigation-enabled="true">
        <slide v-for="(product, index) in products" :key="index">
          <div class="product mr-4">
            <product-manager :product="product" @edit="editProduct" @copy="copyProduct" @preview="openPreviewModal" @uploadPhoto="openUploadPhotoModal" class="full-height">
            </product-manager>
          </div>
        </slide>
      </carousel>
    </div>
    <product-form ref="productForm"></product-form>
    <product-preview ref="preview" :artist="artist"></product-preview>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ProductForm              from '@/components/artist/product/form';
import ProductManager              from '@/components/artist/product/manager';
import ProductPreview           from '@/components/artist/product/preview';
export default {
  components: {
    ProductForm,
    ProductManager,
    ProductPreview
  },
  async asyncData({ store, app }) {
    await store.dispatch('artist/loadMyProducts');
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    ...mapState({ products: (state) => state.artist.artist.products })
  },
  data() {
    return {
      selectedProduct: {}
    }
  },
  methods: {
    ...mapActions('protected', ['renewAuth']),
    ...mapActions('artist', ['loadProducts']),
    newProduct() {
      this.$refs.productForm.newProduct()
    },
    editProduct(product) {
      this.$refs.productForm.editProduct(product)
    },
    async copyProduct(product) {
      await this.saveProduct(product)
      this.$toast.success('Produto copiado')
    },
    openItemForm(item) {
      this.$refs.productItem.openModal()
    },
    openConfirmRemove(productId) {
      this.$refs.removeProductDialog.openModal(productId)
    },
    openUploadPhotoModal(product) {
      this.selectedProduct = product
      this.$refs.photoUploader.openUploadModal()
    },
    openPreviewModal(product) {
      this.$refs.preview.openModal(product)
    },
    async save(product) {
      await this.saveProduct(product);
      await this.renewAuth(); // Remove product setup notification
      this.$toast.success('Produto salvo');
    },
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