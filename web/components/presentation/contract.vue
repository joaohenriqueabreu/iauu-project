<template>
  <div>
    <div class="boxed shadow p-4 mb-5">
      <nuxt-link :to="otherPartyLink" target="_blank">
        <h3 class="mb-4 horizontal middle">{{ otherParty.name }} <span class="badge ml-4 cap">{{ otherPartyLabel }}</span></h3>
      </nuxt-link>      
      <div class="horizontal middle">
        <avatar v-if="!$empty(otherParty.photo)" :src="$images(otherParty.photo)" :size="100" :username="otherParty.name" class="mr-5"></avatar>
        <div class="vertical full-width">
          <p class="mb-3"><icon icon="id-card"></icon>{{ otherParty.company_document }}</p>
          <p class="mb-3"><icon icon="envelope"></icon>{{ otherParty.company_email }}</p>
          <p class="mb-3"><icon icon="phone"></icon>{{ otherParty.company_phone | phone }}</p>
          <p class="mb-3"><icon icon="map-marker-alt"></icon>{{ otherParty.company_address }}</p>
        </div>
      </div>      
    </div>
    <h4 class="mb-2">Anexe documentos</h4>
    <small>A aprovação dos documentos na plataforma pode (ou não) caracterizar validade jurídica dos mesmos. </small>
    <br>
    <small>Por favor <nuxt-link to="/terms" target="_blank"><u><small>consulte nossos termos de serviço e revise nossas políticas</small></u></nuxt-link> sobre documentos compartilhados na plataforma</small>
    <document-uploader @uploaded="uploadPresentationDocument"></document-uploader>
    <hr>
    <h5 class="my-2">Lista de documentos</h5>    
    <div class="d-flex flex-row flex-wrap align-items-stretch mt-4">
      <div v-for="(document, index) in presentation.documents" :key="index" class="document full-height mr-4 mb-4">        
        <div class="boxed shadow full-height">
          <document-thumbnail :document="document"></document-thumbnail>         
        </div>        
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import DocumentUploader         from '@/components/file/fileUploader';
import DocumentThumbnail        from '@/components/presentation/documentThumbnail';
export default {
  components: {
    DocumentThumbnail,
    DocumentUploader,
  },
  data() {
    return {
      documentToRemove: {},
    }
  },
  computed: {
    ...mapState({ presentation: (state) => state.presentation.presentation }),
    otherParty() {
      return this.$auth.hasScope('artist') ? this.presentation.contractor : this.presentation.artist;
    },
    otherPartyLabel() {
      return this.$auth.hasScope('artist') ? 'contratante' : 'artista';
    },
    otherPartyLink() {
      return '/public/' + (this.$auth.hasScope('artist') ? 'contractor/' : 'artist/') + this.otherParty.id;
    }
  },
  methods: {
    ...mapActions('presentation', ['uploadDocument', 'approveDocument', 'reproveDocument']),
    async uploadPresentationDocument(file) {
      await this.uploadDocument(file);
      this.$toast.success('Documento enviado com sucesso');
    },
  }
}
</script>

<style lang="scss" scoped>
.badge {
  font-size: $small;
  background: $layer2;
  color: $layer5;
  padding: $space;
  border-radius: $edges;
}

.document {
  width: 150px;
}
</style>