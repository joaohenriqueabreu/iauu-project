<template>
  <div>
    <div class="vertical center middle mb-4">
      <h6>Qual estilo artístico da sua empresa?</h6>
    </div>
    <fade-transition mode="out-in">
      <div v-show="$empty(artist.category.name)" class="horizontal center middle">
        <div v-for="(category, index) in categories" :key="index" class="img-box" @click="getSubcategories(category)">
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
      <div v-show="!$utils.empty(categoryName)" class="vertical center middle mb-4">
        <overlay :rounded="true">
          <avatar :src="categoryImg(categoryName)" :size="70" />
        </overlay>
        <div class="mb-2"></div>
        <div class="horizontal center middle">
          <h6 class="mr-2">{{ categoryName }}</h6>
          <small @click="changeCategory">Trocar</small>
        </div>
      </div>
    </fade-transition>
    <div v-show="!$utils.empty(categoryName)" class="select">
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
    <div class="tags">
      <span v-for="(subcategory, index) in subCategories" :key="index" @click="removeSubcategory(subcategory)">
        <h6>{{ subcategory }}</h6>
        <font-awesome icon="times"></font-awesome>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import TagCollection from './tagCollection'
export default {
  extends: TagCollection,
  props: {
    categories: { type: Array, default: () => {} }
  },
  data() {
    return {
      subCategoryOptions: { type: Object, default: () => {} }
    }
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    ...mapFields('artist', {
      categoryName: 'artist.category.name',
      subCategories: 'artist.category.subcategories',
    })
  },
  async mounted() {
    if (this.$empty(this.categoryName)) { return }
    await this.getSubcategories(this.categoryName)
  },
  methods: {
    ...mapActions('artist', ['saveProfile']),
    async getSubcategories(category) {
      const { data } = await this.$axios.get(
        `categories/${encodeURI(this.categoryName)}/subcategories`
      )

      this.subCategoryOptions = this.$collection.orderBy(data, [], ['asc'])
    },
    categoryImg(item) {
      try {
        if (this.$empty(item)) { throw 'invalid category' }
        return this.$images(`categories/${item}.jpg`)
      } catch (error) {
        return this.$images('concert.png')
      }
    },
    isCategorySelected(name) {
      return name === this.artist.category.name
    },
    changeCategory() {
      this.categoryName = null
      this.subCategories = []
    },
    addSubcategory(subcategory) {
      if (this.subCategories.length >= this.$config.maxAllowedSubcategories) {
        this.$toast.error(`Máximo de ${this.$config.maxAllowedSubcategories} etilos permitidos`)
        return
      }

      if (!this.$collection.includes(this.subCategories, subcategory)) {
        // Seems that vuex-map-fields does not support push operation, therefore we need to copy the array, transform and assign it as whole to the state
        let subcategories = this.$object.clone(this.subCategories)
        subcategories.push(subcategory)
        this.subCategories = subcategories
      }

      this.saveProfile()
    },
    removeSubcategory(subcategory) {
      const index = this.$array.indexOf(this.subCategories, subcategory)
      this.$delete(this.subCategories, index)
      this.saveProfile()
    }
  }
}
</script>
