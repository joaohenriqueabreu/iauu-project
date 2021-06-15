<template>
  <div class="position-relative">
    <small>Enviado por {{ owner.name }} em {{ document.create_dt | date }}</small>
    <a :href="file.url" target="_blank">      
      <div class="vertical center middle h-10">
        <icon icon="file-contract" class="huge"></icon>
      </div>
      <div class="one-line text-center">
        <h6>{{ file.name }}</h6>
      </div>
    </a>
    <div class="h-5">
      <hr>
      <div v-if="displayApproveBtns" class="my-2 p-2 horizontal center middle">
        <h6 class="horizontal middle clickable brand-hover" @click="openDocumentModal">
          <icon v-if="!document.has_approval && document.requires_approval" v-tooltip="'Este documento requer aprovacao'" icon="exclamation-triangle" class="error font-large"></icon>
          Revisar
        </h6>
      </div>
      <div v-if="document.uploaded_by === $auth.user.main_role && ! document.is_approved" class="horizontal center middle">
        <h6 class="clickable brand-hover" @click="openDocumentModal">Editar</h6>
      </div>
      <div v-if="document.is_approved" class="vertical center middle">
        <h6 class="color-success">Aprovado</h6>
        <small>{{ document.approval.approval_dt | date }}</small>
      </div>
      <div v-if="document.is_rejected" class="color-error vertical center middle">
        <h6>Reprovado</h6>
      </div>
    </div>
    <document-manager ref="document" :document="document"></document-manager>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import DocumentManager          from '@/components/presentation/documentManager';
export default {
  components: {
    DocumentManager,
  },
  props: {
    document: { type: Object, default: () => {}},
  },
  async mounted() {
    await this.loadFile(this.document.file_id);
  },
  computed: {
    ...mapState({ presentation: (state) => state.presentation.presentation }),
    ...mapState({ file: (state) => state.file.file }),
    displayApproveBtns() {
      return this.document.requires_approval && 
        ! this.document.approval.approved && 
        this.document.uploaded_by != this.$auth.user.main_role;
    },
    owner() {
      return this.document.uploaded_by === 'artist' ? this.presentation.artist : this.presentation.contractor;
    }
  },
  methods: {
    ...mapActions('file', ['loadFile']),
    openDocumentModal() {
      this.$refs.document.openModal();
    },
  }
}
</script>

<style lang="scss" scoped>

</style>