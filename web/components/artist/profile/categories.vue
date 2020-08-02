<template>
  <div>
    <div class="vertical center middle">
      <h6 class="mb-4">Qual tipo de apresentação sua empresa realiza?</h6>
    </div>
    <fade-transition mode="out-in">
      <div v-show="$utils.empty(artist.category.name)" class="horizontal center middle">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="img-box"
          @click="getSubcategories(category)"
        >
          <h6>
            {{ category.name }}
          </h6>
          <overlay :selected="isCategorySelected(category.name)">
            <avatar :src="categoryImg(category.name)" :size="70" />
          </overlay>
        </div>
      </div>
    </fade-transition>
    <fade-transition mode="out-in">
      <div v-show="!$utils.empty(artist.category.name)" class="vertical center middle mb-4">
        <overlay :rounded="true">
          <avatar :src="categoryImg(artist.category.name)" :size="70" />
        </overlay>
        <div class="mb-2"></div>
        <div class="horizontal center middle">
          <h6 class="mr-2">{{ artist.category.name }}</h6>
          <small @click="changeCategory">Trocar</small>
        </div>
      </div>
    </fade-transition>
    <div v-show="!$utils.empty(artist.category.name)" class="subcategory-select">
      <h6></h6>
      <form-select
        :options="subCategoryOptions"
        :auto-open="true"
        :hide-selected="false"
        label="Selecione os estilos de apresentação"
        @selected="addSubcategory"
      ></form-select>
    </div>
    <div class="mb-4"></div>
    <div class="subcategory-tags">
      <span
        v-for="(subcategory, index) in artist.category.subcategories"
        :key="index"
        @click="removeSubcategory(subcategory)"
      >
        <h6>{{ subcategory }}</h6>
        <font-awesome icon="times"></font-awesome>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    categories: { type: Array, default: () => {} }
  },
  data() {
    return {
      subCategories: { type: Object, default: () => {} }
    }
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    subCategoryOptions() {
      return this.$collection.map(this.subCategories, (subcategory) => subcategory.name)
    }
  },
  methods: {
    ...mapMutations('artist', { updateProfile: 'update_profile' }),
    async getSubcategories(category) {
      this.updateProfile({ prop: 'category.name', data: category.name })
      const { data } = await this.$axios.get(
        `categories/${encodeURI(this.artist.category.name)}/subcategories`
      )

      this.subCategories = data
    },
    categoryImg(item) {
      try {
        return require(`@/assets/imgs/categories/${item}.jpg`)
      } catch {
        return require('@/assets/imgs/concert.png')
      }
    },
    isCategorySelected(name) {
      return name === this.artist.category.name
    },
    changeCategory() {
      this.updateProfile({ prop: 'category.name', data: null })
      this.updateProfile({ prop: 'category.subcategories', data: [] })
    },
    addSubcategory(subcategory) {
      const subcategories = this.$object.clone(this.artist.category.subcategories)

      if (!this.$collection.includes(subcategories, subcategory)) {
        subcategories.push(subcategory)
        this.updateProfile({ prop: 'category.subcategories', data: subcategories })
      }
    },
    removeSubcategory(subcategory) {
      const subcategories = this.$object.clone(this.artist.category.subcategories)
      const index = this.$array.indexOf(subcategories, subcategory)
      this.$delete(subcategories, index)
      this.updateProfile({ prop: 'category.subcategories', data: subcategories })
    }
  }
}
</script>

<style lang="scss" scoped>
small {
  cursor: pointer;
  transition: $transition;
  &:hover {
    transition: $transition;
    color: $layer5;
  }
}
.img-box {
  @extend .horizontal, .middle, .center;
  // max-height: 50px;
  // max-width: 50px;
  overflow: hidden;
  cursor: pointer;
  margin-right: 4 * $space;
  margin-bottom: 4 * $space;
  // background-position: center;
  // background-repeat: no-repeat;
  // background-size: cover;
  box-shadow: $shadow;
  position: relative;
  border-radius: $rounded;
  h6 {
    position: absolute;
    // left: 25%;
    top: 45%;
    z-index: $above;
  }
}

.subcategory-select {
  @extend .half-width;
  transition: $transition;
}

.subcategory-tags {
  @extend .horizontal, .center, .middle;
  width: 100%;
  span {
    @extend .horizontal, .center, .middle;
    border-radius: $rounded;
    background: $layer3;
    padding: 2 * $space;
    min-width: 5vw;
    margin-right: 2 * $space;
    cursor: pointer;
    transition: $transition;

    h6 {
      margin-bottom: 0;
      margin-right: 3 * $space;
    }

    &:hover {
      transition: $transition;
      background: $layer1;
      opacity: 0.6;
    }
  }
}

h6 {
  text-transform: capitalize;
}
</style>
