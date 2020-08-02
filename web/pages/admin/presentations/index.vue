<template>
  <div>
    <div class="vertical mb-5">
      <div class="vertical middle mb-4">
        <h4 class="mr-4">Propostas & Apresentações</h4>
        <form-input class="full-width mr-5" v-model="searchTerm" @enter="handleSearch" @blur="handleSearch" placeholder="Pesquisa" icon="music"></form-input>
      </div>
      <div class="horizontal">
        <span v-for="status in ['proposal', 'rejected', 'accepted', 'completed', 'cancelled']" 
          :key="status" 
          :class="{status, selected: status === filter}" 
          class="status-badge mr-4 horizontal center middle clickable" 
          @click="filterByStatus(status)">
          <font-awesome :icon="statusIcon(status)" class="mr-2"></font-awesome>
          {{ statusLabel(status) }}s
        </span>
      </div>
    </div>
    <perfect-scrollbar>
      <table class="full-width">
        <thead>
          <th></th>
          <th>Título</th>
          <th>Artista</th>
          <th>Contratante</th>
          <th>Data</th>
        </thead>
        <tbody>
          <tr v-for="(presentation, index) in presentations" :key="index" @click="openPresentationManagementModal(presentation)">
            <td class="text-center">
              <div class="status-badge icon-only" :class="presentation.status">
                <font-awesome :icon="statusIcon(presentation.status)"></font-awesome>
              </div>
            </td>
            <td class="py-3 cap">
              <span class="mr-2">{{ presentation.proposal.title }}</span>
            </td>
            <td class="py-3 cap">
              <span class="mr-2">{{ presentation.artist.user.name }}</span>
            </td>
            <td class="py-3 cap">
              <span class="mr-2">{{ presentation.contractor.user.name }}</span>
            </td>
            <td>{{ presentationDate(presentation) | date }}</td>
          </tr>
        </tbody>
      </table>
    </perfect-scrollbar>
    <presentation-management ref="presentation" :presentation="selectedPresentation" @updated="loadPresentations">
    </presentation-management>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import PresentationManagement from '@/components/admin/presentation'
export default {
  async asyncData({ store }) {
    await store.dispatch('admin/loadPresentations')
  },
  components: {
    PresentationManagement
  },
  computed: {
    ...mapState({ allPresentations: (state) => state.admin.presentations }),
    ...mapGetters('admin', ['proposalPresentations', 'rejectedPresentations', 'acceptedPresentations', 'completedPresentations', 'cancelledPresentations']),
  },
  data() {
    return {
      filter: null,
      searchTerm: '',
      presentations: [],
      selectedPresentation: {}
    }
  },
  mounted() {
    this.presentations = this.allPresentations
  },
  watch: {
    allPresentations(value) {
      this.presentations = value
    }
  },
  methods: {
    ...mapActions('admin', ['loadPresentations', 'searchPresentation']),
    async handleSearch() {
      if (this.$empty(this.searchTerm)) {
        await this.loadPresentations()
        return 
      }

      await this.searchPresentations(this.searchTerm)
    },
    presentationDate(presentation) {
      if (presentation.status === 'proposal') {
        return presentation.proposal.timeslots[0].start_dt
      }

      return presentation.timeslot.start_dt
    },
    filterByStatus(status) {
      if (this.filter === status) {
        this.presentations = this.allPresentations
        this.filter = null
        return
      }

      this.filter = status

      if (status === 'proposal') { this.presentations = this.proposalPresentations }
      if (status === 'rejected') { this.presentations = this.rejectedPresentations }
      if (status === 'accepted') { this.presentations = this.acceptedPresentations }
      if (status === 'completed') { this.presentations = this.completedPresentations }
      if (status === 'cancelled') { this.presentations = this.cancelledPresentations }
    },
    statusLabel(status) {
      if (status === 'proposal') { return 'Proposta'}
      if (status === 'rejected') { return 'Recusada'}
      if (status === 'accepted') { return 'Contratada'}
      if (status === 'completed') { return 'Realizada'}
      if (status === 'cancelled') { return 'Cancelada'}
      return ''
    },
    statusIcon(status) {
      if (status === 'proposal') { return 'dollar-sign' }
      if (status === 'rejected') { return 'thumbs-down' }
      if (status === 'accepted') { return 'music' }
      if (status === 'completed') { return 'check' }
      if (status === 'cancelled') { return 'times' }
      return ''
    },
    openPresentationManagementModal(presentation) {
      this.selectedPresentation = presentation
      this.$refs.presentation.openModal()
    },
  }
}
</script>

<style lang="scss" scoped>
.ps {
  max-height: 60vh;
}

table {
  tr {
    padding-bottom: 4 * $space;
    transition: $transition;
    &:hover {
      transition: $transition;
      background: $layer5;
    }
  }
}

.boxed {
  @extend .vertical, .middle, .center;
  background: $layer4;
  box-shadow: $shadow;
  border-radius: $edges;
  padding: 4 * $space;
}

.role-badge, .status-badge, .verification-label {
  &.icon-only {
    width: 25px;
    height: 25px;
  }

  &.selected {
    background: $brandLayer;
  }

  padding: $space;
  border-radius: $edges;
  [data-icon] {
    margin: 0;
  }

  // Status specific classes
  &.proposal { background: $layer5; }
  &.rejected, &.cancelled { background: $error; }
  &.accepted { background: $info;  }
  &.completed { background: $green; }
}

.login-as {
  background: $layer5;
  padding: 5px;
  height: 20px;
  width: 20px;
  border-radius: $rounded;
  transition: $transition;
  &:hover {
    transition: $transition;
    color: $brandLayer;
  }
}
</style>