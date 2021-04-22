<template>
  <div class="vertical middle center">
    <div class="half-width">
      <h4 class="mb-4 text-center">
        Conta pra gente os detalhes do seu evento para finalizar a proposta ao artista
      </h4>
      <form-input v-model="title" class="mb-2" icon="child" placeholder="Título do seu evento">
      </form-input>
      <form-location street :default="proposal.address" placeholder="Onde será o evento?" @selected="changeAddress">
      </form-location>
      <form-textarea v-model="description" class="mb-2" :rows="3" placeholder="Conte mais sobre o seu evento">
      </form-textarea>
      <!-- No documents for now -->
      <!-- <div class="vertical mb-5">
        <fade-transition group>
          <attachment v-for="(document, index) in documents" :key="index" :file="document" removable @remove="removeDocument(index)">
          </attachment>
        </fade-transition>
      </div> -->
      <fade-transition>
        <form-button v-show="validForm" @action="$emit('next')">Avançar</form-button>
      </fade-transition>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Location       from '@/models/location'
import Step           from '@/components/proposal/steps/step'

export default {
  extends: Step,
  data() {
    return {
      title:        '',
      address:     new Location(),
      description:  '',
      documents:    []
    }
  },
  computed: {
    validForm() {
      return !this.$utils.empty(this.title) && !this.$utils.empty(this.address)
    }
  },
  watch: {
    title(title)              { this.editProposal({ prop: 'title',        value: title }); },
    address(address)          { this.editProposal({ prop: 'address',      value: address }); },
    description(description)  { this.editProposal({ prop: 'description',  value: description }); },
    documents(documents)      { this.editProposal({ prop: 'documents',    value: documents }); },
    validForm(valid) {
      if (valid) {
        this.$emit('complete');
        return;
      }

      this.$emit('incomplete');
    }
  },
  mounted() {
    this.title        = this.proposal.title;
    this.address      = this.proposal.address;
    this.description  = this.proposal.description;
    this.documents    = this.proposal.documents;
  },
  methods: {
    ...mapActions('proposal', ['editProposal']),
    changeAddress(address) { this.address = address; },

    // TODO when/if using documents
    // uploadDocument()            { this.$refs.fileUploader.upload(); },
    // documentUploaded(document)  { this.details.documents.push(document); }
  }
}
</script>
