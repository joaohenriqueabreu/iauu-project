<template>
  <div>
    <div class="vertical mb-5">
      <div class="horizontal middle mb-4">
        <h4 class="mr-4">Usuários</h4>
        <form-input
          v-model="searchTerm"
          class="full-width mr-5"
          placeholder="Pesquisa"
          icon="user"
          @enter="handleSearchUsers"
          @blur="handleSearchUsers"
        ></form-input>
      </div>
      <div class="horizontal d-flex justify-content-between">
        <div class="horizontal">
          <span
            v-for="role in ['artist', 'contractor']"
            :key="role"
            :class="{ role, selected: role === filter }"
            class="role-badge mr-4 horizontal center middle clickable"
            @click="filterByRole(role)"
          >
            <icon :icon="roleIcon(role)" class="mr-2"></icon>
            {{ roleLabel(role) }}s
          </span>
          <span
            v-for="status in ['active', 'blocked', 'pending']"
            :key="status"
            :class="{ status, selected: status === filter }"
            class="status-badge mr-4 horizontal center middle clickable"
            @click="filterByStatus(status)"
          >
            <icon :icon="statusIcon(status)" class="mr-2"></icon>
            {{ statusLabel(status) }}s
          </span>
        </div>
        <div class="horizontal clickable brand-hover" @click="exportCsv">
          <icon class="mr-2" icon="file-excel"></icon>
          <h6>Exportar</h6>
        </div>
      </div>
    </div>
    <table class="full-width">
      <thead>
        <th>Tipo</th>
        <th>Status</th>
        <th>Nome</th>
        <th>Email</th>
        <th>Admissão</th>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" @click="openUserManagementModal(user)">
          <td class="text-center">
            <h6 class="role-badge icon-only" :class="user.role">
              <icon :icon="roleIcon(user.role)"></icon>
            </h6>
          </td>
          <td class="text-center">
            <div class="status-badge icon-only" :class="user.status">
              <icon :icon="statusIcon(user.status)"></icon>
            </div>
          </td>
          <td class="py-3 cap horizontal middle">
            <span class="mr-2">{{ user.name }}</span>
          </td>
          <td>{{ user.email }}</td>
          <td>{{ user.create_dt | date }}</td>
        </tr>
      </tbody>
    </table>
    <user-management ref="user" @updated="loadUsers"></user-management>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex';
import UserManagement from '@/components/admin/user';
export default {
  components: {
    UserManagement
  },
  async asyncData({ store }) {
    await store.dispatch('admin/loadUsers');
  },
  computed: {
    ...mapState({ allUsers: (state) => state.admin.users }),
    ...mapState({ selectedUser: (state) => state.admin.user }),
    ...mapState({ userStats: (state) => state.admin.statistics.users }),
    ...mapGetters('admin', [
      'adminUsers',
      'artistUsers',
      'contractorUsers',
      'pendingUsers',
      'activeUsers',
      'blockedUsers'
    ]),
    usersData() {
      if (this.users === undefined) { return []; }
      let data = [];
      const self = this;
      this.users.forEach((user) => {
        data.push([user.id, user.email, user.name, self.roleLabel(user.role)])
      });

      return data;
    },
    userLoaded() {
      return !this.$empty(this.selectedUser) && !this.$empty(this.userStats);
    }
  },
  data() {
    return {
      filter: null,
      searchTerm: '',
      users: []
    }
  },
  watch: {
    allUsers(value) {
      this.users = value;
    }
  },
  mounted() {
    this.users = this.allUsers;
  },
  methods: {
    ...mapActions('admin', ['loadUsers', 'loadUserStats', 'searchUsers']),
    async handleSearchUsers() {
      if (this.$empty(this.searchTerm)) {
        await this.loadUsers();
        return;
      }

      await this.searchUsers(this.searchTerm);
    },
    filterByRole(role) {
      if (this.filter === role) {
        this.users = this.allUsers;
        this.filter = null;
        return;
      }

      this.filter = role;

      if (role === 'artist') { this.users = this.artistUsers; }
      if (role === 'contractor') { this.users = this.contractorUsers; }
    },
    filterByStatus(status) {
      if (this.filter === status) {
        this.users = this.allUsers;
        this.filter = null;
        return;
      }

      this.filter = status;

      if (status === 'pending') { this.users = this.pendingUsers; }
      if (status === 'active') { this.users = this.activeUsers; }
      if (status === 'blocked') { this.users = this.blockedUsers; }
    },
    statusLabel(status) {
      if (status === 'pending') { return 'Aguardando verificação' }
      if (status === 'active') { return 'Ativo' }
      if (status === 'blocked') { return 'Bloqueado'; }
      return '';
    },
    statusIcon(status) {
      if (status === 'pending') { return 'ellipsis-h'; }
      if (status === 'active') { return 'check'; }
      if (status === 'blocked') { return 'lock'; }
      if (status === 'unassigned') { return 'question-circle'; }
      return '';
    },
    roleLabel(role) {
      if (role === 'artist') { return 'Artista'; }
      if (role === 'contractor') { return 'Contratante'; }
      return '';
    },
    roleIcon(role) {
      if (role === 'artist') { return 'music'; }
      if (role === 'contractor') { return 'dollar-sign'; }
      if (role === 'none') { return 'user'; }
      return '';
    },
    verificationLabel(verified) {
      return verified ? 'Verificado' : 'Aguardando verificação';
    },
    async openUserManagementModal(user) {
      await this.loadUserStats(user.id);
      this.$refs.user.openModal();
    },
    exportCsv() {
      this.$csv.download(this.$csv.convert(JSON.stringify(this.usersData)));
    }
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

.role-badge,
.status-badge,
.verification-label {
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
  &.admin {
    background: $layer1;
  }
  &.artist {
    background: $layer5;
  }
  &.contractor {
    background: $brandLayer;
    color: $layer5;
  }

  // Status specific classes
  &.pending {
    background: $layer5;
  }
  &.active {
    background: $green;
  }
  &.blocked {
    background: $error;
  }

  &.verified {
    background: $green;
  }
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
