<template>
  <div>
    Billings page
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