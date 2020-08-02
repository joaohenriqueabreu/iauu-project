<template>
  <modal ref="modal" height="small">
    <template v-slot:header>
      Item da apresentação
    </template>
    <template v-slot:main>
      <p>
        Adicione um item para seus formatos de apresentação. Um item é uma parte da apresentação,
        como iluminação, percussão, o próprio show, ou outros itens especiais e que podem variar de
        acordo com seus formatos de apresentação (um formato possui iluminação própria o outro não)
      </p>
      <form-input v-model="item.name" class="mr-2 mb-2"></form-input>
      <form-textarea v-model="item.description"></form-textarea>
    </template>
    <template v-slot:footer>
      <form-button class="half-width" @action="$emit('save', item)">Salvar</form-button>
    </template>
  </modal>
</template>

<script>
export default {
  data() {
    return {
      item: {
        name: '',
        description: ''
      }
    }
  },
  methods: {
    openModal(item) {
      if (!this.$utils.empty(item)) {
        this.item = item
      }

      this.$refs.modal.open()
    }
  }
}
</script>

<style></style>
