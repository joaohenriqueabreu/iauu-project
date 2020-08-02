<template>
  <div>
    <div class="vertical center middle mb-5 mx-5">
      <h6 class="mb-3">
        Escolha palavras-chave que estão associadas a sua apresentação, para que sejam encontrados
        para mais eventos.
      </h6>
      <div class="horizontal center middle">
        <form-input
          v-model="searchTag"
          placeholder="Casamento, aniversários, palco, iluminação ..."
          class="full-width mr-4"
          @blur="addTag"
        >
        </form-input>
        <font-awesome icon="plus" class="clickable" @click="addTag"></font-awesome>
      </div>
    </div>
    <div class="tags">
      <span v-for="(tag, index) in artist.tags" :key="index" @click="removeTag(tag)">
        <h6 class="mr-2">{{ tag }}</h6>
        <font-awesome icon="times"></font-awesome>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      searchTag: ''
    }
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist })
  },
  methods: {
    ...mapMutations('artist', { updateProfile: 'update_profile' }),
    addTag() {
      if (this.searchTag.length === 0) {
        return
      }

      const tags = this.$object.clone(this.artist.tags)

      if (!this.$collection.includes(tags, this.searchTag)) {
        tags.push(this.searchTag)
        this.updateProfile({ prop: 'tags', data: tags })
        this.searchTag = ''
      }
    },
    removeTag(tag) {
      const tags = this.$object.clone(this.artist.tags)
      const index = this.$array.indexOf(tags, tag)
      this.$delete(tags, index)
      this.updateProfile({ prop: 'tags', data: tags })
    }
  }
}
</script>

<style lang="scss" scoped>
.tags {
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
</style>
