<template>
  <div>
    <div class="vertical mb-5">
      <div class="horizontal middle mb-4">
        <h4 class="mr-4">Usuários</h4>
        <form-input class="full-width mr-5" v-model="searchTerm" @enter="handleSearchUsers" @blur="handleSearchUsers" placeholder="Pesquisa" icon="user"></form-input>
      </div>
      <div class="horizontal">
        <span v-for="role in ['artist', 'contractor']" 
          :key="role" 
          :class="{role, selected: role === filter}" 
          class="role-badge mr-4 horizontal center middle clickable" 
          @click="filterByRole(role)">
          <font-awesome :icon="roleIcon(role)" class="mr-2"></font-awesome>
          {{ roleLabel(role) }}s
        </span>
        <span v-for="status in ['active', 'blocked', 'pending']" 
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
          <th></th>
          <th>Nome</th>
          <th>Email</th>
          <th>Admissão</th>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" @click="openUserManagementModal(user)">
            <td class="text-center">
              <h6 class="role-badge icon-only" :class="user.role"><font-awesome :icon="roleIcon(user.role)"></font-awesome></h6>
            </td>
            <td class="text-center">
              <div class="status-badge icon-only" :class="user.status"><font-awesome :icon="statusIcon(user.status)"></font-awesome></div>
            </td>
            <td class="py-3 cap horizontal middle">
              <span class="mr-2">{{ user.name }}</span>
            </td>
            <td>{{ user.email }}</td>
            <td>{{ user.created_at | date }}</td>
          </tr>
        </tbody>
      </table>
    </perfect-scrollbar>
    <user-management ref="user" :user="selectedUser" :stats="userStats" @updated="loadUsers"></user-management>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import UserManagement from '@/components/admin/user'
export default {
  async asyncData({ store }) {
    await store.dispatch('admin/loadUsers')
  },
  components: {
    UserManagement
  },
  computed: {
    ...mapState({ allUsers: (state) => state.admin.users }),
    ...mapState({ selectedUser: (state) => state.admin.user }),
    ...mapState({ userStats: (state) => state.admin.stats.users }),
    ...mapGetters('admin', ['adminUsers', 'artistUsers', 'contractorUsers', 'pendingUsers', 'activeUsers', 'blockedUsers']),
  },
  data() {
    return {
      filter: null,
      searchTerm: '',
      users: []
    }
  },
  mounted() {
    this.users = this.allUsers
  },
  watch: {
    allUsers(value) {
      this.users = value
    }
  },
  methods: {
    ...mapActions('admin', ['loadUsers', 'loadUserStats', 'searchUsers']),
    async handleSearchUsers() {
      if (this.$empty(this.searchTerm)) {
        await this.loadUsers()
        return 
      }

      await this.searchUsers(this.searchTerm)
    },
    filterByRole(role) {
      if (this.filter === role) {
        this.users = this.allUsers
        this.filter = null
        return
      }

      this.filter = role

      if (role === 'artist') { this.users = this.artistUsers }
      if (role === 'contractor') { this.users = this.contractorUsers }
    },
    filterByStatus(status) {
      if (this.filter === status) {
        this.users = this.allUsers
        this.filter = null
        return
      }

      this.filter = status

      if (status === 'pending') { this.users = this.pendingUsers }
      if (status === 'active') { this.users = this.activeUsers }
      if (status === 'blocked') { this.users = this.blockedUsers }
    },
    statusLabel(status) {
      if (status === 'pending') { return 'Aguardando verificação' }
      if (status === 'active') { return 'Ativo' }
      if (status === 'blocked') { return 'Bloqueado' }
      return ''
    },
    statusIcon(status) {
      if (status === 'pending') { return 'ellipsis-h' }
      if (status === 'active') { return 'check' }
      if (status === 'blocked') { return 'lock' }
      return ''
    },
    roleLabel(role) {
      if (role === 'artist') { return 'Artista' }
      if (role === 'contractor') { return 'Contratante' }
      return ''
    },
    roleIcon(role) {
      if (role === 'artist') { return 'music' }
      if (role === 'contractor') { return 'dollar-sign' }
      return ''
    },
    verificationLabel(verified) {
      return verified ? 'Verificado' : 'Aguardando verificação'
    },
    async openUserManagementModal(user) {
      await this.loadUserStats(user.id)
      this.$refs.user.openModal()
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

  // Role specific classes
  &.admin { background: $layer1; }
  &.artist { background: $layer5; }
  &.contractor { 
    background: $brandLayer; 
    color: $layer5;
  }

  // Status specific classes
  &.pending { background: $layer5; }
  &.active { background: $green; }
  &.blocked { background: $error;  }

  &.verified { background: $green; }
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