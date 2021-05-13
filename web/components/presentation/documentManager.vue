<template>
  <div>
    <modal v-if="!$empty(document)" tiny ref="modal">
      <template v-slot:header>
        Gerenciar documento
      </template>
      <template v-slot:main>
        <hr>
        <div class="mb-4">
          <a :href="file.url" target="_blank">
            <h4><icon icon="file-pdf"></icon> Arquivo {{ file.name }}</h4>
            <small>Clique para visualizar</small>
          </a>
        </div>
        <hr>
        <div v-if="isDocumentOwner">
          <div class="mb-4" v-if="!document.is_approved">
            <form-toggle v-model="updatedDocument.requires_approval">
              <template v-slot:on>
                Requer aprovação do {{ otherPartyLabel }}
              </template>
            </form-toggle>
          </div>
          <div class="mb-4">
            <form-textarea v-if="!document.is_approved" v-model="updatedDocument.description" placeholder="Propósito do documento"></form-textarea>
            <p v-else>{{ document.description }}</p>
          </div>
        </div>
        <div v-else class="mb-4">
          <h6 class="mb-4">O {{ otherPartyLabel }} requisitou que você revise e aprove o documento.</h6>
          <p>{{ document.description }}</p>
        </div>
        <div v-if="document.is_approved">
          <p>Aprovado pelo <b>{{ otherPartyLabel }}</b> em {{ document.approval.approval_dt | date }}</p>
        </div>
      </template>
      <template v-slot:footer>
        <div v-if="!document.is_approved">
          <div class="horizontal middle center" v-if="isDocumentOwner">
            <form-button @action="save" class="mr-4">Salvar</form-button>
            <u><h5 class="brand-hover clickable" @click="confirmDelete">Excluir</h5></u>
          </div>
          <div v-else-if="document.requires_approval" class="horizontal center middle">
            <form-button @action="confirmApprove" class="mr-4">Aprovar</form-button>
            <u><h5 class="brand-hover clickable" @click="confirmReject">Reprovar</h5></u>
          </div>
        </div>
      </template>
    </modal>
    <confirm-dialog ref="deleteDocumentConfirm" yes-no message="Deseja excluir este documento?" @confirmed="remove"></confirm-dialog>  
    <confirm-dialog ref="approveDocumentConfirm" yes-no @confirmed="approve" message="Confirma a aprovação deste documento?"></confirm-dialog>
    <confirm-dialog ref="rejectDocumentConfirm" yes-no @confirmed="reject" message="Deseja reprovar este documento?"></confirm-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  props: {
    document: { type: Object, default: true },
  },
  data() {
    return {
      updatedDocument: {}
    }
  },
  async mounted() {
    await this.loadFile(this.document.file_id);
    this.updatedDocument = this.$object.clone(this.document);
  },
  computed: {
    ...mapState({ presentation: state => state.presentation.presentation }),
    ...mapState({ file: state => state.file.file }),
    isDocumentOwner() {
      return this.$auth.user.main_role === this.document.uploaded_by;
    },
    otherPartyLabel() {
      return this.$auth.hasScope('artist') ? 'contratante' : 'artista';
    },
    docIndex() {
      return this.$array.findIndex(this.presentation.documents, document => document.id === this.document.id);
    }
  },
  methods: {
    ...mapActions('presentation', ['editDocument', 'approveDocument', 'rejectDocument', 'deleteDocument']),
    ...mapActions('file', ['loadFile']),
    openModal() {
      this.$refs.modal.open();
    },
    confirmApprove() {
      this.$refs.approveDocumentConfirm.show();
    },
    confirmReject() {
      this.$refs.rejectDocumentConfirm.show();
    },
    confirmDelete() {
      this.$refs.deleteDocumentConfirm.show();
    },
    async save() {
      await this.editDocument(this.updatedDocument);
      this.$toast.success('Documento salvo com sucesso');
      this.$refs.modal.close();
    },
    async approve() {
      await this.approveDocument(this.document);
      this.$toast.success('Documento aprovado');
      this.$refs.modal.close();
    },
    async reject() {
      await this.rejectDocument(this.document);
      this.$toast.success('Documento aprovado');
      this.$refs.modal.close();
    },
    async remove() {
      await this.deleteDocument(this.document.id);
      this.$toast.info('Documento removido com sucesso');
      this.$refs.modal.close();
    }
  }
}
</script>

<style>

</style>