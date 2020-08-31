<template>
  <div>
    <div class="vertical center middle mb-4">
      <h6>Qual tipo de apresentação sua empresa realiza?</h6>
    </div>
    <div class="select">
      <form-select
        :options="options"
        :auto-open="true"
        :hide-selected="false"
        label="Selecione os tipos de apresentação"
        @selected="addPresentationType"
      ></form-select>
    </div>
    <div class="mb-4"></div>
    <div class="tags">
      <span v-for="(presentationType, index) in presentationTypes" :key="index" @click="removePresentationType(presentationType)">
        <h6>{{ presentationType }}</h6>
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
    options: { type: Array, default: () => {}}
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    ...mapFields('artist', {
      presentationTypes: 'artist.presentation_types',
    })
  },
  methods: {
    ...mapActions('artist', ['saveProfile']),
    addPresentationType(presentationType) {
      if (this.presentationTypes.length >= this.$config.maxAllowedPresentationTypes) {
        this.$toast.error(`Máximo de ${this.$config.maxAllowedPresentationTypes} tipos permitidos`)
        return
      }

      if (!this.$collection.includes(this.presentationTypes, presentationType)) {
        // Seems that vuex-map-fields does not support push operation, therefore we need to copy the array, transform and assign it as whole to the state
        let presentationTypes = this.$object.clone(this.presentationTypes)
        presentationTypes.push(presentationType)
        this.presentationTypes = presentationTypes
      }

      this.saveProfile()
    },
    removePresentationType(presentationType) {
      let presentationTypes = this.$object.clone(this.presentationTypes)
      const index = this.$array.indexOf(presentationTypes, presentationType)      
      this.$delete(presentationTypes, index)
      this.presentationTypes = presentationTypes
      this.saveProfile()
    }
  }
}
</script>
