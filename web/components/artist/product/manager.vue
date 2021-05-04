<template>
  <div class="full-height" :class="readOnly ? 'clickable' : ''" @click="readOnlyPreview">
    <div class="info full-height">              
      <image-uploader ref="productPhoto" @uploaded="uploadPhoto">
        <div class="media" :class="!readOnly ? 'clickable' : ''" :style="{'background-image': `url(${$images(productPhoto)})`}">
        </div>
      </image-uploader>
      <div class="product">
        <div v-if="!readOnly" class="copy clickable" @click="copyProduct">
          <h4 class="brand-hover"><icon icon="copy"></icon></h4>
        </div>
        <div v-if="!readOnly" class="title my-4" @click="editProduct">
          <h2 class="cap one-line brand-hover">
            <icon icon="edit" class="mr-2"></icon>{{ product.name }}
          </h2>
        </div>
        <div v-else>
          <h2 class="cap mb-2 one-line">{{ product.name }}</h2>
        </div>
        <div v-if="!hidePrice" class="horizontal middle mb-3">
          <span class="mr-4">
            <b>{{ product.price | currency }}</b>
          </span>
          <span>
            <icon icon="clock" class="mr-1"></icon>
            {{ product.duration | longTime }}
          </span>
        </div>
        <div v-if="!readOnly" class="description one-line mb-3">
          {{ product.description }}
        </div>
        <div class="one-line mb-5">
          <icon icon="check"></icon>Itens inclusos no formato
          <span v-for="(item, index) in product.items" :key="`item_${index}`" class="mr-2">
            <b>{{ item }}</b><span v-if="index < $array.lastIndexOf(product.items)">,</span>
          </span>
        </div>
        <div v-if="!readOnly" class="vertical middle center">
          <form-button class="mb-3" @action="editProduct">Modificar</form-button>
          <h6 class="clickable" @click="previewProduct">Preview</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    product:    { type: Object, default: () => {} },
    readOnly:   { type: Boolean, default: false },
    hidePrice:  { type: Boolean, default: false },
  },
  computed: {
    productPhoto() {
      return !this.$utils.empty(this.product.photo)
        ? this.product.photo
        : this.$config.defaultBGImgUrl;
    }
  },
  methods: {
    ...mapActions('artist', ['saveProduct']),
    editProduct() {
      this.$emit('edit', this.product);
    },
    previewProduct() {
      this.$emit('preview', this.product);
    },
    readOnlyPreview() {
      if (!this.readOnly) { return; }
      this.$emit('preview', this.product);
    },
    async copyProduct() {
      const product = this.$object.clone(this.product);
      product.id    = null;
      product.name  = `Cópia de ${product.name}`;
      await this.saveProduct(product);
      this.$toast.success('Produto copiado');
    },
    async uploadPhoto(url) {
      // Don't allow uploading photo if contractor is viewing product
      if (this.readOnly) { return; }

      const product = this.$object.clone(this.product);
      product.photo = url;
      await this.saveProduct(product);
      this.$toast.success('Foto adicionada ao produto');
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
  padding: 4 * $space;
  position: relative;

  // main {
  background: none !important;

  .copy {
    position: absolute;
    top: 10px;
    right: 10px;
  }

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