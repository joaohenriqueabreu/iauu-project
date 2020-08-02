/* eslint-disable */
<template>
  <div>
    <modal ref="form">
      <template v-slot:header>
        <h4>Salvar formato de apresentação</h4>
      </template>
      <template v-slot:main>
        <div class="new-product-form vertical p-4">
          <form-input v-model="product.name" label="Título" class="mb-4"></form-input>
          <form-textarea
            v-model="product.description"
            label="Descrição"
            class="mb-4"
          ></form-textarea>
          <div class="row mb-5">
            <div class="vertical middle center col-sm-6">
              <h6 class="mr-3">Preço para Contratar</h6>
              <form-money v-model="product.price" class="mr-2" placeholder="100,00"></form-money>
            </div>
            <div class="vertical middle center col-sm-6">
              <h6 class="mr-3">Duração da Apresentação</h6>
              <form-numeric
                v-model="product.duration"
                icon="clock"
                placeholder="4 horas"
              ></form-numeric>
            </div>
          </div>
          <div class="vertical middle mb-5">
            <h6 class="mb-2">Adicionar items</h6>
            <small>Liste aqui os itens deste formato</small>
            <div class="horizontal middle justify-content-between mb-2">
              <form-input
                v-model="newItem"
                class="full-width mb-5"
                icon="list-ol"
                placeholder="Iluminação, Apresentação, Fogos de Artifício, etc..."
              ></form-input>
              <font-awesome icon="plus" class="ml-5 clickable" @click="addItem"></font-awesome>
            </div>
            <div
              v-for="(item, itemIndex) in product.items"
              :key="itemIndex"
              class="items d-flex justify-content-between"
            >
              <span>{{ item }}</span>
              <font-awesome
                icon="times"
                class="clickable"
                @click="removeItem(itemIndex)"
              ></font-awesome>
            </div>
            <div class="vertical d-flex justify-content-between mb-2">
              <h6>Adicionar Fotos e Vídeos de suas apresetações</h6>
            </div>
            <div class="horizontal middle full-width mb-2">
              <form-input
                v-model="newMedia.url"
                class="full-width"
                placeholder="Cole o link de suas midias sociais aqui"
              ></form-input>
              <font-awesome icon="plus" class="clickable ml-5" @click="uploadMedia"></font-awesome>
            </div>
            <fade-transition group class="mb-5">
              <div v-for="(media, mediaIndex) in product.medias" :key="mediaIndex">
                <media-thumbnail
                  class="mb-2"
                  simple
                  removable
                  :media="media"
                  @remove="removeMedia(mediaIndex)"
                ></media-thumbnail>
              </div>
            </fade-transition>
            <div class="horizontal d-flex justify-content-between mb-2">
              <h6>Adicionar documentos</h6>
              <font-awesome
                icon="plus"
                class="ml-2 clickable"
                @click="uploadDocument"
              ></font-awesome>
            </div>
            <div class="vertical mb-5">
              <fade-transition group>
                <attachment
                  v-for="(document, docIndex) in product.documents"
                  :key="docIndex"
                  :file="document"
                  removable
                  @remove="removeDocument(docIndex)"
                ></attachment>
              </fade-transition>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="horizontal center middle my-4">
          <form-button @action="save">Salvar</form-button>
          <div class="clickable ml-4" @click="openConfirmModal">
            Remover formato
          </div>
        </div>
      </template>
    </modal>
    <modal ref="confirm" height="tiny">
      <template v-slot:main class="vertical middle center">
        <h1 class="vertical middle center">
          <font-awesome icon="exclamation-circle" class="mb-4"></font-awesome>
        </h1>
        Remover o formato não irá cancelar propostas ou apresentações associadas a ele. Você deve
        manualmente rejeitá-las ou redefini-las com seus clientes.
      </template>
      <template v-slot:footer>
        <div class="horizontal center middle">
          <form-button class="my-4" @action="remove">Excluir mesmo assim</form-button>
          <div class="clickable ml-4" @click="closeConfirmModal"><h6>Cancelar</h6></div>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import * as filestack from 'filestack-js'
import Product from '@/models/product'
import Media from '@/models/media'
export default {
  data() {
    return {
      product: new Product(),
      newItem: '',
      newMedia: new Media(),
      editMode: false
    }
  },
  created() {
    this.client = filestack.init(process.env.fileStackApiKey)
  },
  methods: {
    newProduct() {
      this.product = new Product()
      this.$refs.form.open()
    },
    editProduct(product) {
      this.$set(this, 'product', this.$object.clone(product))
      this.$refs.form.open()
    },
    openConfirmModal() {
      this.$refs.confirm.open()
    },
    closeConfirmModal() {
      this.$refs.confirm.close()
    },
    addItem() {
      this.product.items.push(this.newItem)
    },
    removeItem(index) {
      this.$delete(this.product.items, index)
    },
    uploadDocument() {
      const options = {
        lang: 'pt',
        fromSources: ['local_file_system'],
        accept: ['.pdf'],
        onUploadDone: this.documentUploaded
      }
      this.client.picker(options).open()
    },
    documentUploaded({ filesUploaded }) {
      this.product.documents.push(this.getMediaFromUpload(filesUploaded[0]))
    },
    getMediaFromUpload(file) {
      const media = new Media()
      media.type = file.mimetype
      media.name = file.filename
      media.url = file.url
      return media
    },
    removeDocument(index) {
      this.$delete(this.product.documents, index)
    },
    uploadMedia() {
      if (this.$utils.empty(this.newMedia.url)) {
        return
      }

      this.product.medias.push(this.newMedia)
      this.newMedia = new Media()
    },
    removeMedia(index) {
      this.$delete(this.product.medias, index)
    },
    save() {
      this.$emit('save', this.product)
      this.$refs.form.close()
    },
    remove() {
      this.$emit('remove', this.product)
      this.$refs.confirm.close()
      this.$refs.form.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.new-product-form {
  height: 400px;
}

.thumb-container {
  @extend .horizontal, .middle;
  border-radius: $rounded;
  box-shadow: $shadow;
  margin-bottom: 2 * $space;
  padding: $space;
}

.items {
  border-bottom: 2px solid $layer5;
  padding-bottom: 2 * $space;
  margin-bottom: 2 * $space;
}
</style>

/* eslint-disable */
