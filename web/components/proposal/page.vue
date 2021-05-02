<template>
  <div>
    <div v-if="!$empty(proposals)" class="vertical">
      <h6 class="mb-4">Últimas propostas</h6>
      <div v-for="(proposal, id) in proposals" :key="id" @click="open(id)">
        <proposal-info :presentation="proposal"></proposal-info>
      </div>
      <proposal-details ref="proposal" :read-only="false"></proposal-details>
    </div>
    <div v-else>
      <h6>Nenhuma proposta encontrada</h6>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
export default {
  // Not sure why, but this is not working on ayncData(after getting artist and contractor from microservices)
  // async asyncData({store}) {
  //   await store.dispatch('proposal/loadProposals');
  // },
  async mounted() {
    await this.loadProposals();
  },
  computed: {
    ...mapState({proposals: (state) => state.proposal.proposals}),
    ...mapState({proposal:  (state) => state.proposal.proposal})
  },
  methods: {
    ...mapActions('proposal', ['loadProposals', 'loadProposal']),
    async open(id) {
      await this.loadProposal(id);
      this.$refs.proposal.openModal();
    }
  }
}
</script>

<style lang="scss" scoped></style>
