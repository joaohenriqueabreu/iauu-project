<template>
  <div>
    <div class="vertical center middle mb-4">
      <h6>Quais os estilos sua banda toca?</h6>
    </div>
    <!-- <fade-transition mode="out-in">
      <div v-show="$empty(artist.category.name)" class="horizontal center middle">
        <div v-for="(category, index) in categories" :key="index" class="img-box" @click="getSubcategories(category.name)">
          <h6>
            {{ category.name }}
          </h6>
          <overlay :selected="isCategorySelected(category.name)">
            <avatar :src="categoryImg(category.name)" :size="70" />
          </overlay>
        </div>
      </div>
    </fade-transition> -->
    <!-- <fade-transition mode="out-in">
      <div v-show="!$utils.empty(categoryName)" class="vertical center middle mb-4">
        <overlay :rounded="true">
          <avatar :src="categoryImg(categoryName)" :size="70" />
        </overlay>
        <div class="mb-2"></div>
        <div class="horizontal center middle">
          <h6 class="mr-2">{{ categoryName }}</h6>
          <small @click="resetCategory">Trocar</small>
        </div>
      </div>
    </fade-transition> -->
    <div class="select">
      <h6></h6>
      <form-select :options="subCategoryOptions" :auto-open="true" :hide-selected="false" label="Selecione os estilos de apresentação" @selected="addSubcategory"></form-select>
    </div>
    <div class="mb-4"></div>
    <div class="tags">
      <span v-for="(subcategory, index) in subCategories" :key="index" @click="removeSubcategory(subcategory)">
        <h6>{{ subcategory | capitalize }}</h6>
        <icon icon="times"></icon>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { mapFields }            from 'vuex-map-fields';
import TagCollection            from './tagCollection';

export default {
  extends: TagCollection,
  props: {
    subCategoryOptions: { type: Array, default: () => {} }
  },
  // data() {
  //   return {
  //     subCategoryOptions: { type: Object, default: () => {} }
  //   }
  // },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    ...mapFields('artist', {
      // categoryName: 'artist.category.name',
      subCategories: 'artist.category.subcategories',
    })
  },
  async mounted() {
    // if (! this.$empty(this.categoryName)) {
    //   await this.getSubcategories(this.categoryName);
    // }    
  },
  methods: {
    ...mapActions('artist', ['saveProfile']),
    // async getSubcategories() {
    //   // Only supporting 'banda' for now - therefore loading all categories as subcategories to support existing model
    //   const { data } = await this.$axios.get('data/categories');
    //   this.subCategoryOptions = this.$array.orderBy(data, [], ['asc']);
    // },
    // categoryImg(item) {
    //   try {
    //     if (this.$empty(item)) { throw 'invalid category'; }
    //     return this.$images(`categories/${item}.jpg`);
    //   } catch (error) {
    //     return this.$images('concert.png');
    //   }
    // },
    // isCategorySelected(name) {
    //   return name === this.artist.category.name;
    // },
    // resetCategory() {
    //   this.categoryName = null;
    //   this.subCategories = [];
    // },
    async addSubcategory(subcategory) {
      if (this.subCategories.length >= this.$config.maxAllowedSubcategories) {
        this.$toast.error(`Máximo de ${this.$config.maxAllowedSubcategories} etilos permitidos`);
        return;
      }

      if (!this.$array.includes(this.subCategories, subcategory)) {
        // Seems that vuex-map-fields does not support push operation, therefore we need to copy the array, transform and assign it as whole to the state
        let subcategories = this.$object.clone(this.subCategories);
        subcategories.push(subcategory);
        this.subCategories = subcategories;
      }

      await this.saveProfile();
      this.$toast.success('Categoria adicionada');
    },
    async removeSubcategory(subcategory) {
      let subcategories = [...this.subCategories];

      const index = this.$array.indexOf(subcategories, subcategory);
      this.$delete(subcategories, index);

      this.subCategories = subcategories;
      await this.saveProfile();
      this.$toast.success('Categoria removida');
    }
  }
}
</script>
