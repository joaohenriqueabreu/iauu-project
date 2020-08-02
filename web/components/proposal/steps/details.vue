<template>
  <div class="vertical middle center">
    <div class="half-width">
      <h4 class="mb-4 text-center">
        Conta pra gente os detalhes do seu evento para finalizar a proposta ao artista
      </h4>
      <form-input
        v-model="title"
        class="mb-2"
        icon="child"
        placeholder="Título do seu evento"
      ></form-input>
      <form-location
        street
        :default="proposal.location"
        placeholder="Onde será o evento?"
        @selected="changeLocation"
      ></form-location>
      <form-textarea
        v-model="description"
        class="mb-2"
        :rows="3"
        placeholder="Conte mais sobre o seu evento"
      ></form-textarea>
      <!-- <file-uploader ref="fileUploader" @uploaded="documentUploaded"></file-uploader> -->
      <div class="vertical mb-5">
        <fade-transition group>
          <attachment
            v-for="(document, index) in documents"
            :key="index"
            :file="document"
            removable
            @remove="removeDocument(index)"
          ></attachment>
        </fade-transition>
      </div>
      <fade-transition>
        <form-button v-show="validForm" @action="$emit('next')">Avançar</form-button>
      </fade-transition>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Location from '@/models/location'
import Step from '@/components/proposal/steps/step'

export default {
  extends: Step,
  data() {
    return {
      title: '',
      location: new Location(),
      description: '',
      documents: []
    }
  },
  computed: {
    validForm() {
      return !this.$utils.empty(this.title) && !this.$utils.empty(this.location)
    }
  },
  watch: {
    title(title) {
      this.editProposal({ prop: 'title', value: title })
    },
    location(location) {
      this.editProposal({ prop: 'location', value: location })
    },
    description(description) {
      this.editProposal({ prop: 'description', value: description })
    },
    documents(documents) {
      this.editProposal({ prop: 'documents', value: documents })
    },
    validForm(valid) {
      if (valid) {
        this.$emit('complete')
        return
      }

      this.$emit('incomplete')
    }
  },
  mounted() {
    this.title = this.proposal.title
    this.location = this.proposal.location
    this.description = this.proposal.description
    this.documents = this.proposal.documents
  },
  methods: {
    ...mapActions('contractor', ['editProposal']),
    changeLocation(location) {
      this.location = location
    },
    uploadDocument() {
      this.$refs.fileUploader.upload()
    },
    documentUploaded(document) {
      this.details.documents.push(document)
    }
  }
}
</script>
