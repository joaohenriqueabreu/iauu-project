/* eslint-disable */
<template>
  <div>
    <div class="info full-height">
      <image-uploader v-if="!proposalView" ref="photoUploader" @uploaded="setPhoto">
        <div
          class="media clickable"
          :style="{ 'background-image': `url(${productPhoto})` }"
          @click="uploadPhoto"
        ></div>
      </image-uploader>
      <div v-else class="media" :style="{ 'background-image': `url(${productPhoto})` }"></div>
      <div class="product">
        <div v-if="!proposalView" class="title" @click="editProduct">
          <h2 class="cap mb-2">{{ product.name }}</h2>
          <font-awesome icon="edit" class="ml-4"></font-awesome>
        </div>
        <div v-else>
          <h2 class="cap mb-2">{{ product.name }}</h2>
        </div>
        <div class="horizontal middle mb-3">
          <span class="mr-4">
            <b>{{ product.price | currency }}</b>
          </span>
          <span>
            <font-awesome icon="clock" class="mr-1"></font-awesome>
            {{ product.duration }} horas
          </span>
        </div>
        <div v-if="!proposalView" class="description one-line">
          {{ product.description }}
        </div>
        <div class="items mb-5">
          <div v-for="(item, index) in product.items" :key="`item_${index}`">
            <hr />
            <span class="one-line">
              <font-awesome icon="check" class="mr-2"></font-awesome>
              {{ item }}
            </span>
          </div>
          <div v-for="(item, index) in notItems" :key="`not_${index}`" class="items not-items">
            <hr />
            <span class="one-line">
              <font-awesome icon="check" class="mr-2"></font-awesome>
              {{ item }}
            </span>
          </div>
        </div>
        <div v-if="!proposalView" class="vertical middle center">
          <form-button class="mb-3" @action="editProduct">Modificar</form-button>
          <h6 class="clickable" @click="openPreviewModal">Preview</h6>
        </div>
        <!-- <div v-else class="vertical middle center"> -->
        <!-- <form-button class="mb-3" @action="$emit('selected', product)">Selecionar</form-button> -->
        <!-- <h6 class="clickable" @click="openPreviewModal">Ver mais</h6> -->
        <!-- </div> -->
      </div>
    </div>
    <product-preview v-if="!proposalView" ref="preview"></product-preview>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ProductPreview from '@/components/artist/product/preview'
export default {
  components: {
    'product-preview': ProductPreview
  },
  props: {
    product: { type: Object, default: () => {} },
    proposalView: { type: Boolean, default: false },
    notItems: { type: Array, default: () => {} }
  },
  computed: {
    productPhoto() {
      return !this.$utils.empty(this.product.photo)
        ? this.product.photo
        : this.$config.defaultBGImgUrl
    }
  },
  methods: {
    ...mapActions('artist', ['saveProduct']),
    editProduct() {
      this.$emit('edit', this.product)
    },
    removeProduct() {
      this.$emit('remove', this.product.id)
    },
    uploadPhoto() {
      this.$refs.photoUploader.upload()
    },
    async setPhoto({ url }) {
      const product = this.$object.clone(this.product)
      product.photo = url
      await this.saveProduct(product)
    },
    openPreviewModal() {
      this.$refs.preview.openModal(this.product, this.notItems)
    }
  }
}
</script>

<style lang="scss" scoped>
h6 {
  transition: $transition;
  &:hover {
    transition: $transition;
    color: $brandLayer;
  }
}
.info {
  background: $layer3;
  box-shadow: $shadow;
}

.media {
  min-height: 200px;
  // border-top-left-radius: $edges;
  // border-top-right-radius: $edges;
  background-size: cover;
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.product {
  @extend .vertical, .middle, .center;
  width: 100%;
  // height: 100%;
  // background: $layer3;
  // border-bottom-left-radius: $edges;
  // border-bottom-right-radius: $edges;
  // box-shadow: $shadow;
  padding: 4 * $space;
  position: relative;

  // main {
  background: none !important;

  .title {
    @extend .horizontal, .middle, .center, .full-width, .clickable;
    margin-bottom: 2 * $space;
    transition: $transition;
    color: $brand;

    [data-icon] {
      font-size: $small;
    }

    &:hover {
      transition: $transition;
      color: $layer5;
    }
  }
  // }

  // header {
  //   position: absolute;
  //   top: 5px;
  //   right: 5px;
  //   cursor: pointer;

  //   [data-icon] {
  //     transition: $transition;
  //     &:hover {
  //       transition: $transition;
  //       color: $layer5;
  //     }
  //   }
  // }
}

.items {
  &.not-items {
    [data-icon] {
      color: $layer1;
      background: $layer3;
    }
  }

  [data-icon] {
    color: $brandLayer;
    font-weight: $bold;
    box-shadow: $shadow;
    border-radius: $rounded;
    background: $layer5;
    height: 20px;
    width: 20px;
    padding: 5px;
  }
}

.not-items {
  color: $layer5;
}

// Required for img bg
/deep/ .modal-content {
  padding: 0;
}
</style>
/* eslint-enable */
