<template>
  <modal ref="confirm" height="tiny">
    <template v-slot:main>
      <div class="vertical middle center p-4">
        <h6>Por favor leia essa informação antes de remover um produto</h6>
        <p class="mb-4">
          Ao remover ou alterar um produto apresentações confirmadas não sofrerão alterações
          (utilizando assim o mesmo produto). Caso seja de interesse de ambas as partes, favor
          cancelar a apresentação e renegociar com seu cliente os novos termos do produto
        </p>
        <div class="horizontal center middle">
          <form-button class="mr-4" @action="remove(selectedProductId)"
            >Ok, remover produto</form-button
          >
          <span class="clickable" @click="$refs.confirm.close()">Não remover</span>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      productId: { type: Number, default: 0 }
    }
  },
  methods: {
    ...mapActions('artist', ['removeProduct']),
    openModal(productId) {
      this.productId = productId
      this.$refs.confirm.open()
    }
  }
}
</script>

<style></style>
