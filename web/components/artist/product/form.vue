/* eslint-disable */
<template>
  <div>
    <modal ref="form" header-height="tiny">
      <template v-slot:header>
        <h4>Salvar formato de apresentação</h4>
      </template>
      <template v-slot:main>
        <div class="new-product-form vertical p-4" v-if="!$empty($v)">
          <form-input v-model="$v.product.name.$model" label="Título"></form-input>
          <form-validation :active="$v.product.name.$error" class="mb-4">O nome do formato não pode estar vazio</form-validation>
          <form-textarea
            v-model="product.description"
            label="Descrição"
            class="mb-4"
          ></form-textarea>
          <div class="row mb-5">
            <div class="vertical middle center col-sm-6">
              <h6 class="mr-3">Preço para Contratar</h6>
              <form-money v-model="$v.product.price.$model" class="mr-2" placeholder="100,00"></form-money>
              <form-validation :active="$v.product.price.$error" class="mb-4">Entre com um preço válido</form-validation>
            </div>
            <div class="vertical middle center col-sm-6">
              <h6 class="mr-3">Duração da Apresentação</h6>
              <form-time ref="duration" v-model="$v.product.duration.$model" icon="clock" placeholder="4:00"></form-time>
              <form-validation :active="$v.product.duration.$error" class="mb-4">Entre com uma duração válida</form-validation>
            </div>
          </div>
          <div class="vertical middle mb-5">
            <div class="mb-5">
              <h6 class="mb-2">Adicionar items</h6>
              <small>Liste aqui os itens deste formato</small>
              <form-validation :active="$v.product.items.$invalid" class="mb-4">Adicione ao menos 1 item</form-validation>
              <div class="horizontal middle justify-content-between mb-2">
                <form-input v-model="newItem" class="full-width" icon="list-ol" placeholder="Iluminação, Apresentação, Fogos de Artifício, etc..." @enter="addItem"></form-input>
                <icon icon="plus" class="ml-5 clickable" @click="addItem"></icon>
              </div>
              <div v-for="(item, itemIndex) in product.items" :key="itemIndex" class="items d-flex justify-content-between">
                <span>{{ item }}</span>
                <icon
                  icon="times"
                  class="clickable"
                  @click="removeItem(itemIndex)"
                ></icon>
              </div>
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
              <icon icon="plus" class="clickable ml-5" @click="uploadMedia"></icon>
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
              <icon
                icon="plus"
                class="ml-2 clickable"
                @click="uploadDocument"
              ></icon>
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
          <form-button :disabled="$v.product.$invalid" @action="save">Salvar</form-button>
          <div v-if="!$empty(product.id)" class="clickable ml-4" @click="openConfirmModal">
            Remover formato
          </div>
        </div>
      </template>
    </modal>
    <modal ref="confirm" height="tiny">
      <template v-slot:main class="vertical middle center">
        <h1 class="vertical middle center">
          <icon icon="exclamation-circle" class="mb-4"></icon>
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
import { required, minValue, numeric, minLength, contains, helpers } from 'vuelidate/lib/validators'
import * as filestack from 'filestack-js'
import Product from '@/models/product'
import Media from '@/models/media'

function minTime(value) {
  return this.$date.convertTimeToNumber(value) >= this.$config.minDurationInMinutes
}

export default {
  data() {
    return {
      product: new Product(),
      newItem: '',
      newMedia: new Media(),
      editMode: false
    }
  },
  validations: {
    product: {
      name:     { required },
      price:    { required, numeric, minValue: minValue(1) },
      duration: { required, minTime },
      items:    { required, minLength: minLength(1) }
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
      this.newItem = ''
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
      if (this.$empty(this.product.documents)) {
        this.product.documents = []
      }

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
      if (this.$utils.empty(this.newMedia.url)) { return }

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
