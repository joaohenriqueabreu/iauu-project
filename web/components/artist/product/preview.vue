<template>
  <modal ref="modal" hide-header no-pad>
    <template v-slot:main>
      <div class="bg-image" :style="{ 'background-image': `url(${$images(productPhoto)})` }"></div>
      <carousel
        v-if="!$utils.empty(product.medias)"
        :per-page="2"
        :navigation-enabled="true"
        :pagination-enabled="false">
        <slide
          v-for="(media, index) in product.medias"
          :key="index"
          class="clickable media-preview"
          @slideclick="openMedia(media)">
          <media-viewer :media="media"></media-viewer>
        </slide>
      </carousel>
      <div class="vertical middle center mb-4">
        <h2 class="mb-4">{{ product.name }}</h2>
        <div v-if="!product.custom" class="mb-4">
          <h5>{{ product.price | currency }} para {{ product.duration }} horas de apresentacao</h5>
        </div>
        <p class="px-4">{{ product.description }}</p>
      </div>
      <div v-if="!$empty(product.items)" class="px-5 mb-5">
        <h5>O que está incluido neste formato?</h5>
        <div v-for="(item, index) in product.items" :key="index">
          <hr />
          <span>
            <icon icon="check" class="mr-2"></icon>
            <b>{{ item }}</b>
          </span>
        </div>
      </div>
      <div v-if="!$empty(notIncludedItems)" class="px-5">
        <h5 class="mb-2">O que não está incluido neste formato?</h5>
        <small>Oferecemos estes itens em outros produtos. Selecione um formato mais completo se desejar contratar.</small>
        <div v-for="(item, index) in notIncludedItems" :key="index" class="not-items">
          <hr />
          <span>
            <icon icon="times" class="mr-2"></icon>
            <b>{{ item }}</b>
          </span>
        </div>
      </div>
      <div class="mb-5">&nbsp;</div>
    </template>
    <template v-slot:footer v-if="proposal">
      <div class="horizontal middle center full-height d-flex justify-content-between">
        <div>
          <h4>{{ product.price | currency }}</h4>
        </div>
        <div>
          <h4 class="horizontal">
            <icon icon="clock" class="mr-"></icon>{{ product.duration }} horas
          </h4>
        </div>
        <div>
          <form-button @action="selectProduct">Selecionar</form-button>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    proposal: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
  },
  data() {
    return {
      product:          {},
      notIncludedItems: []
    }
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    productPhoto() {
      return !this.$utils.empty(this.product.photo)
        ? this.product.photo
        : this.$config.defaultBGImgUrl
    }
  },
  methods: {
    openMedia(media) {
      window.open(media.url, '_blank');
    },
    openModal(product) {
      if (this.$empty(product)) { return; }

      this.product          = product;
      this.notIncludedItems = this.$array.difference(this.artist.product_items, this.product.items);
      this.$refs.modal.open();
    },
    selectProduct() {
      this.$emit('selected', this.product);
      this.$refs.modal.close();
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-image {
  background-size: cover;
  // position: absolute;
  // top: 0;
  // left: 0;
  width: 100%;
  height: 30vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom: 2 * $space;
}

.media-preview {
  max-width: 25vw;
  margin-right: 2 * $space;
  margin-left: 2 * $space;
}

.not-items {
  color: $layer5;
}

/deep/ footer {
  background: $layer1;
}
</style>
