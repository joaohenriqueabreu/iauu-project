<template>
  <div>
    <h3 class="mb-4">Faturas de shows</h3>
    <table class="table">
      <thead>
        <tr>
          <th>Apresentação</th>
          <th>Artista</th>
          <th>Data</th>
          <th>Valor</th>
          <th>Pago</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(billing, index) in billings" :key="index">
          <td>{{ billing.presentation_id }}</td>
          <td>{{ billing.artist_account.name }}</td>
          <td></td>
          <td>{{ billing.total_amount | currency }}</td>
          <td>{{ billing.total_paid | currency }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  async asyncData({ store }) {
    try {
      await store.dispatch('admin/loadBillings');
    } catch (error) {
      console.log(error);
    }
  },
  computed: {
    ...mapState({ billings: (state) => state.admin.billings }),
  }
}
</script>

<style>

</style>