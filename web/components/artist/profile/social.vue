<template>
  <div class="vertical center middle">
    <div class="vertical center mb-2">
      <h6 class="mb-2">Conecte suas redes sociais</h6>
      <small class="mx-5 px-sm-5 mb-2">
        Navegue até suas redes sociais busque pelo link de referência para a página principal,
        copie e cole na caixa da texto e adicione a sua lista de redes sociais para que os
        clientes possam visualizar suas produções quando forem contratá-los.
      </small>
    </div>
    <div class="vertical half-width mb-4">
      <fade-transition group class="horizontal middle center">
        <div v-for="(network, index) in artist.social" :key="index">
          <media-avatar class="mb-2 mr-4" removable :media="network" @remove="unlink(index)">
          </media-avatar>
        </div>
      </fade-transition>
      <div class="horizontal middle full-width">
        <form-input
          v-model="newNetwork"
          icon="thumbs-up"
          class="full-width"
          placeholder="Cole o link de suas midias sociais aqui"
          @enter="link"
        ></form-input>
        <font-awesome icon="plus" class="clickable ml-3" @click="link"></font-awesome>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      newNetwork: ''
    }
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist })
  },
  methods: {
    ...mapMutations('artist', { updateProfile: 'update_profile' }),
    async link() {
      if (this.$utils.empty(this.newNetwork)) {
        return
      }

      const networks = this.getArtistSocialNetworks()
      networks.push(this.newNetwork)
      await this.updateProfile({ prop: 'social', data: networks })
      this.newNetwork = ''
    },
    unlink(index) {
      const networks = this.getArtistSocialNetworks()
      this.$delete(networks, index)
      this.updateProfile({ prop: 'social', data: networks })
    },
    getArtistSocialNetworks() {
      return this.$object.clone(this.artist.social)
    },
    openInfoModal() {
      this.$refs.info.open()
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-box {
  @extend .horizontal, .middle, .center;
  margin: 0 5 * $space;

  [data-icon] {
    color: $layer5;
    font-size: 55px;
    font-weight: $bold;
    // box-shadow: $shadow;
    filter: drop-shadow($shadow);
    // border-radius: $rounded;
    transition: $transition;
    cursor: pointer;
    &:hover {
      transition: $transition;
      color: $brand;
    }
    &.active {
      transition: $transition;
      color: $brand;
    }
  }
}

.info {
  cursor: pointer;
  [data-icon] {
    margin-right: 2 * $space;
    margin-left: $space;
  }
}
</style>
