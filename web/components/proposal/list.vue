<template>
  <div>
    <div class="mb-5 horizontal middle">
      <form-date v-model="filters.from" class="mr-4">
        Recebidas de:
      </form-date>
      <form-date v-model="filters.to" class="mr-2">
        Recebidas até:
      </form-date>
      <div class="p-4 filter badge circle clickable horizontal center middle" :class="{ active: filters.from != null || filters.to != null }" @click="loadFilteredProposals">
        <icon icon="calendar-alt" class="mr-0"></icon>
      </div>      
      <div class="filter" :class="{ active: filters.status === 'proposal' }" @click="loadOpenProposals">Abertas</div>
      <div class="filter" :class="{ active: filters.status === 'accepted' }" @click="loadAcceptedProposals">Contratadas</div>
      <div class="filter" :class="{ active: filters.status === 'rejected' }" @click="loadRejectedProposals">Rejeitadas</div>
    </div>
    <div v-if="!$empty(unreadProposals)" class="vertical mb-5">
      <h6 class="horizontal middle mb-4">Propostas não lidas <span class="badge circle brand">{{ unreadProposals.length }}</span></h6>
      <div v-for="(proposal, index) in unreadProposals" :key="index" @click="open(proposal)">
        <proposal-info :presentation="proposal"></proposal-info>
      </div>      
    </div>
    <div v-if="!$empty(otherProposals)" class="vertical">            
      <h6 class="mb-4">Propostas recebidas</h6>
      <div v-for="(proposal, index) in otherProposals" :key="index" @click="open(proposal)">
        <proposal-info :presentation="proposal"></proposal-info>
      </div>      
    </div>
    <div v-if="$empty(unreadProposals) && $empty(otherProposals)">
      <h6>Nenhuma proposta recebida</h6>
    </div>
    <proposal-details v-if="!$empty(proposal)" @rejected="afterReject" ref="proposal" :read-only="false"></proposal-details>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex';
export default {
  async mounted() {
    this.filters = { 
      status: 'proposal',
      from:   this.$route.query.from,
      to:     this.$route.query.to
    }

    await this.loadFilteredProposals();
  },
  data() {
    return {
      filters: {
        status: 'proposal',
        from:   '',
        to:     '',
      }
    }
  },
  computed: {
    ...mapGetters('proposal', ['unreadProposals', 'otherProposals']),
    ...mapState({proposal:  (state) => state.proposal.proposal})
  },
  methods: {
    ...mapActions('proposal', ['loadProposals', 'loadProposal', 'markProposalRead', 'resetProposal']),
    async open(proposal) {
      await this.loadProposal(proposal.id);
      if (! proposal.is_read) { await this.markProposalRead(); }
      
      this.$refs.proposal.openModal();
    },
    async loadOpenProposals() {
      this.filters.status = this.filters.status === 'proposal' ? null : 'proposal';
      this.filters.from   = null;
      this.filters.to     = null;
      await this.loadFilteredProposals();
    },
    async loadAcceptedProposals() {
      this.filters.status = this.filters.status === 'accepted' ? null : 'accepted';
      this.filters.from   = null;
      this.filters.to     = null;
      await this.loadFilteredProposals();
    },
    async loadRejectedProposals() {
      this.filters.status = this.filters.status === 'rejected' ? null : 'rejected';
      this.filters.from   = null;
      this.filters.to     = null;
      await this.loadFilteredProposals();
    },
    async loadFilteredProposals(status) {
      this.filters.status = status == null || this.filters.status === status ? null : status;
      await this.loadProposals(this.filters);
    },
    async afterReject() {
      this.$refs.proposal.closeModal();
      this.$toast.success('Proposta recusada');
      this.resetProposal();
      this.loadProposals();
    }
  }
}
</script>

<style lang="scss" scoped>
.filter {
  padding:        2 * $space;
  transition:     $transition;
  background:     $layer4;
  border-radius:  $rounded;
  color:          $brand;
  font-weight:    $bold;
  margin-right:   $space;
  cursor:         pointer;

  &:hover {
    transition: $transition;
    background: $brandLayer;
  }

  &.active {
    background: $brandLayer;
  }
}
</style>