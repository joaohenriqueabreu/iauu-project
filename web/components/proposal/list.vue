<template>
  <div>
    <div class="mb-3 horizontal middle">
      <form-input v-model="filters.text" class="mr-4">Contem:</form-input>
      <form-date v-model="filters.from" class="mr-4">Recebidas de:</form-date>
      <form-date v-model="filters.to" class="mr-2">Recebidas até:</form-date>
    </div>
    <div class="horizontal middle mb-5">
      <div v-if="filters.text" class="filter" :class="{ active: filters.text != null }" @click="$set(filters, 'text', null)"><icon icon="times"></icon> Contem: "{{ filters.text }}"</div>
      <div v-if="filters.from" class="filter" :class="{ active: filters.from != null }" @click="$set(filters, 'from', null)"><icon icon="times"></icon> De: {{ filters.from | date }}</div>
      <div v-if="filters.to" class="filter" :class="{ active: filters.to != null }" @click="$set(filters, 'to', null)"><icon icon="times"></icon> Até: {{ filters.to | date }}</div>
      <div class="filter" :class="{ active: filters.status === 'proposal' }" @click="$set(filters, 'status', filters.status === 'proposal' ? null : 'proposal')">Abertas</div>
      <div class="filter" :class="{ active: filters.status === 'accepted' }" @click="$set(filters, 'status', filters.status === 'accepted' ? null : 'accepted')">Contratadas</div>
      <div class="filter" :class="{ active: filters.status === 'rejected' }" @click="$set(filters, 'status',filters.status === 'rejected' ? null : 'rejected')">Rejeitadas</div>
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
  },
  data() {
    return {
      filters: {
        text:   '',
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
  watch: {
    filters: {
      async handler(value) {
        // Don't allow searching with few chars text
        // if (value.text != null && value.text.length < 3) { return; }

        await this.loadProposals({
          text:     value.text == null || value.text == '' ? null : value.text,
          status:   value.status,
          from:     value.from != null ? this.moment(value.from).format('YYYY-MM-DD') : null,
          to:       value.to != null ? this.moment(value.to).format('YYYY-MM-DD') : null,
        }); 
      },
      deep: true,
    }
  },
  methods: {
    ...mapActions('proposal', ['loadProposals', 'loadProposal', 'markProposalRead', 'resetProposal']),
    async open(proposal) {
      await this.loadProposal(proposal.id);
      if (! proposal.is_read) { await this.markProposalRead(); }
      
      this.$refs.proposal.openModal();
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
  @extend .horizontal, .middle;
  padding:        2 * $space;
  transition:     $transition;
  background:     $layer4;
  border-radius:  $rounded;
  color:          $brand;
  font-weight:    $bold;
  margin-right:   2 * $space;
  cursor:         pointer;

  &:hover {
    transition:   $transition;
    background:   $brandLayer;
  }

  &.active {
    background:   $brandLayer;
    color:        $layer1;
  }
}
</style>