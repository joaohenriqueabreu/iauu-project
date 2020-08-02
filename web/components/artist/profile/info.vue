<template>
  <div class="">
    <form-input
      v-model="companyName"
      class="mb-3"
      icon="signature"
      label="Nome fantasia"
      placeholder="Seu nome incrível vem aqui"
    ></form-input>
    <form-textarea
      v-model="story"
      class="mb-3"
      label="História"
      :rows="5"
      placeholder="Conte um pouquinho da sua história para seus clientes"
    ></form-textarea>
    <hr />
    <div class="row">
      <div class="col-sm-2"></div>
      <div class="col-sm-8">
        <form-masked v-model="document" icon="id-card" placeholder="CPF/CNPJ" mask="document">
        </form-masked>
        <form-location
          :default="artist.address"
          street
          placeholder="Endereço"
          :model="artist"
          prop="address"
          @selected="updateLocation"
        ></form-location>
        <form-masked v-model="phone" icon="phone" placeholder="Telefone" mask="phone"></form-masked>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  data() {
    return {
      info: { type: Object, default: () => {} }
    }
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    ...mapFields('artist', {
      companyName: 'artist.company_name',
      story: 'artist.story',
      document: 'artist.document',
      phone: 'artist.phone'
    })
  },
  created() {
    this.info = this.artist || {}
  },
  methods: {
    ...mapMutations('artist', { updateProfile: 'update_profile' }),
    async updateLocation(value) {
      await this.updateProfile({ prop: 'address', data: value })
    }
  }
}
</script>

<style lang="scss" scoped></style>
