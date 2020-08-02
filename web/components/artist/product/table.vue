<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <!-- item name -->
          <th></th>
          <th v-for="(product, pHeader) in products" :key="pHeader">
            <div class="clickable horizontal center middle" @click="$emit('edit-product', product)">
              <font-awesome icon="edit" class="mb-2 ml-2"></font-awesome>
              <h5 class="mb-2 cap">{{ product.name }}</h5>
            </div>
            <h6 class="horizontal center middle">
              {{ product.price | currency }}
              <span class="mr-4"></span>
              <font-awesome icon="clock" class="mr-1"></font-awesome> {{ product.duration }}
            </h6>
          </th>
        </tr>
      </thead>
      <tbody v-if="products.length > 0">
        <tr v-for="(item, iIndex) in items" :key="iIndex">
          <td class="vertical" @click="openItemForm(item)">
            <h6>{{ item.name }}</h6>
            <span class="small">{{ item.description }}</span>
          </td>
          <td v-for="(product, pIndex) in products" :key="pIndex" class="text-center">
            <font-awesome
              :class="selection[pIndex][iIndex] ? 'active' : 'inactive'"
              icon="check"
              class="select"
              @click="toggleSelection({ product: pIndex, item: iIndex })"
            ></font-awesome>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  computed: {
    ...mapState({ products: (state) => state.artist.products }),
    ...mapState({ items: (state) => state.artist.items }),
    ...mapState({ selection: (state) => state.artist.selection })
  },
  methods: {
    ...mapMutations('product', { toggleSelection: 'toggle_product_item_selection' })
  }
}
</script>

<style lang="scss">
.table {
  td,
  th {
    transition: $transition;
    color: $brand;
    &:hover {
      transition: $transition;
      color: $brandLayer;
    }
  }

  [data-icon] {
    &.select {
      box-shadow: $shadow;
      border-radius: $rounded;
      font-size: $small;
      height: 20px;
      width: 20px;
      padding: 3px;
      transition: $transition;
    }

    &.active {
      // &:hover {
      //   transition: $transition;
      //   background: transparent;
      //   color: $layer5;
      // }
      background: $brandLayer;
      color: $brand;
    }

    &.inactive {
      // &:hover {
      //   transition: $transition;
      //   background: $brandLayer;
      //   color: $brand;
      // }
      background: transparent;
      color: $layer5;
    }
  }
}
</style>
