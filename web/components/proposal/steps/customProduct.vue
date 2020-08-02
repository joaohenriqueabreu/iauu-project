<template>
  <modal ref="modal" height="small">
    <template v-slot:header>
      <h4>Monte sua apresentação</h4>
    </template>
    <template v-slot:main>
      <h6 class="mb-2">Escolha os itens que deseja incluir em sua apresentação</h6>
      <p class="mb-5">O artista irá retornar brevemente com o valor final da apresentação</p>
      <div class="vertical mx-5">
        <perfect-scrollbar>
          <div v-for="(item, index) in allItems" :key="index" class="items mb-3" :class="{ selected: isCustomItemSelected(item) }" @click="toggleItem(item)">
            <div class="horizontal">
              <font-awesome icon="check" class="mr-5"></font-awesome>
              <h6 class="mb-2">{{ item }}</h6>
            </div>
            <hr />
          </div>
        </perfect-scrollbar>
      </div>
      <form-textarea v-model="notes" placeholder="Observações" :rows="5" class="mb-5"></form-textarea>
    </template>
    <template v-slot:footer>
      <div class="vertical center">
        <form-button v-if="customItems.length > 0" class="mb-3 half-width" @action="selectProduct">Selecionar</form-button>
        <span v-else class="error mb-3">Selecione um ou mais itens</span>
        <span class="clickable text-center" @click="cancel">Escolher outro formato</span>
      </div>
    </template>
  </modal>
</template>

<script>
import Product from '@/models/product'
export default {
  props: {
    allItems: { type: Array, default: () => {} }
  },
  data() {
    return {
      customItems: [],
      notes: ''
    }
  },
  methods: {
    openModal() {
      this.$refs.modal.open()
    },
    toggleItem(item) {
      if (!this.customItems.includes(item)) {
        this.customItems.push(item)
        return
      }

      // Use vue delete to trigger reactivity
      this.$delete(this.customItems, this.customItems.indexOf(item))
    },
    isCustomItemSelected(item) {
      return this.$collection.includes(this.customItems, item)
    },
    selectProduct() {
      this.$emit(
        'selected',
        new Product({
          name: 'custom',
          description: this.notes,
          items: this.customItems
        })
      )
      this.$refs.modal.close()
    },
    cancel() {
      this.$refs.modal.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.items {
  transition: $transition;
  cursor: pointer;

  &.selected {
    transition: $transition;
    color: $brandLayer;
  }

  [data-icon] {
    cursor: pointer;
    border-radius: $rounded;
    height: 20px;
    width: 20px;
    padding: 5px;
    background: $layer4;
    box-shadow: $shadow;
  }
}

.ps {
  max-height: 25vh;
}
</style>
