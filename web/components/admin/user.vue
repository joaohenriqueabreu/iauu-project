<template>
  <modal ref="modal">
    <template v-if="!$empty(user)" v-slot:header>
      <div class="d-flex justify-content-between p-2">
        <div class="horizontal middle">
          <avatar :src="user.photo" :username="user.name" class="mr-4"></avatar>
          <div class="vertical middle">
            <h4 class="mb-2">{{ user.name }}</h4>
            <div class="horizontal middle">
              <h6 class="status-badge mr-4" :class="user.status">{{ statusLabel(user.status) }}</h6>
              <h6 class="verification-badge" :class="{ verified: user.status }">
                {{ verificationLabel(user.verification.is_verified) }}
              </h6>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-end">
          <h5 class="identifier" :class="user.role">{{ roleLabel(user.role) }}</h5>
        </div>
      </div>
    </template>
    <template v-if="!$empty(user)" v-slot:main>
      <div class="p-2">
        <h4 class="mb-4">Informações</h4>
        <div>ID</div>
        <h6 class="mb-4">{{ user.id }}</h6>
        <div>Email</div>
        <h6 class="mb-4">{{ user.email }}</h6>
        <div>Admissão</div>
        <h6 class="mb-4">{{ user.create_dt | date }}</h6>
        <div class="mb-4">
          <div>Último Login</div>
          <h6 v-if="!$empty(user.last_logged_in_at)" class="mb-4">
            {{ user.last_logged_in_at | datetime }}
          </h6>
          <h6 v-else>-</h6>
        </div>
        <div v-if="!isVerified" class="mb-4">
          <div>Verificação</div>
          <div class="horizontal middle">
            <div class="vertical">
              <h6 class="mr-4">Enviado em {{ user.verification.issued_at | datetime }}</h6>
              <small class="error">Expira em {{ verifyTokenExpiry | datetime }}</small>
            </div>
            <h6 class="clickable" @click="handleResendVerification"><u>Reenviar</u></h6>
          </div>
        </div>
      </div>
      <div v-if="!$empty(stats)" class="p-2">
        <hr />
        <h4 class="mb-4">Estatísticas</h4>
        <div class="row">
          <div v-if="!$empty(stats.presentations)" class="col-sm-3 mb-4">
            <div class="boxed">
              <h5>{{ stats.presentations[0].count }}</h5>
              <h6>Apresentações</h6>
            </div>
          </div>
          <div v-if="!$empty(stats.proposals)" class="col-sm-3 mb-4">
            <div class="boxed">
              <h5>{{ stats[0].proposals.count }}</h5>
              <h6>Propostas</h6>
            </div>
          </div>
          <div v-if="!$empty(stats.rejected)" class="col-sm-3 mb-4">
            <div class="boxed">
              <h5>{{ stats[0].rejected[0].count }}</h5>
              <h6>Rejeitadas</h6>
            </div>
          </div>
          <div v-if="!$empty(stats.accepted)" class="col-sm-3 mb-4">
            <div class="boxed">
              <h5>{{ stats[0].accepted[0].count }}</h5>
              <h6>Contratads</h6>
            </div>
          </div>
          <div v-if="!$empty(stats.completed)" class="col-sm-3 mb-4">
            <div class="boxed">
              <h5>{{ stats[0].completed[0].count }}</h5>
              <h6>Realizadas</h6>
            </div>
          </div>
          <div v-if="!$empty(stats.cancelled)" class="col-sm-3 mb-4">
            <div class="boxed">
              <h5>{{ stats[0].cancelled[0].count }}</h5>
              <h6>Canceladas</h6>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div class="p-2">
        <h4 class="mb-4">Gerenciar</h4>
        <div class="row">
          <div v-if="['active', 'pending'].includes(user.status)" class="col-sm-4 mb-4">
            <form-button @action="handleBlockUser">Bloquear</form-button>
          </div>
          <div v-if="['blocked', 'pending'].includes(user.status)" class="col-sm-4 mb-4">
            <form-button @action="handleActivateUser">Ativar</form-button>
          </div>
          <div v-if="!isVerified" class="col-sm-4 mb-4">
            <form-button @action="handleVerification">Verificar usuário</form-button>
          </div>
          <div class="col-sm-4 mb-4">
            <form-button @action="handleChangePassword">Alterar de senha</form-button>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="full-height horizontal middle center">
        <form-button @action="handleLoginAs(user.id)">Fazer login como {{ user.name }}</form-button>
      </div>
    </template>
  </modal>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  props: {
    // user: { type: Object, default: () => {} },
    // stats: { type: Array, default: () => {} }
  },
  data() {
    return {
      name: ''
    }
  },
  computed: {
    ...mapState({ user: (state) => state.admin.user }),
    ...mapState({ stats: (state) => state.admin.statistics.users }),
    isVerified() {
      return !this.$empty(this.user.verification) && this.user.verification.is_verified;
    },
    verifyTokenExpiry() {
      return this.moment(this.user.verification.issued_at)
        .add('1', 'days')
        .toString();
    }
  },
  mounted() {
    this.name = this.user.name;
  },
  methods: {
    ...mapActions('admin', ['blockUser', 'activateUser', 'resendVerification', 'verifyUser']),
    openModal() {
      this.$refs.modal.open();
    },
    statusLabel(status) {
      if (status === 'pending') {
        return 'Aguardando verificação';
      }
      if (status === 'active') {
        return 'Ativo';
      }
      if (status === 'blocked') {
        return 'Bloqueado';
      }
      return '';
    },
    roleLabel(role) {
      if (role === 'artist') {
        return 'Artista';
      }
      if (role === 'contractor') {
        return 'Contratante';
      }
      return '';
    },
    verificationLabel(verified) {
      return verified ? 'Verificado' : 'Aguardando verificação';
    },
    async handleBlockUser() {
      await this.blockUser(this.user);
      this.$toast.success('Usuário bloqueado com sucesso');
      this.$emit('updated');
    },
    async handleActivateUser() {
      await this.activateUser(this.user);
      this.$toast.success('Usuário ativado com sucesso');
      this.$emit('updated');
    },
    async handleResendVerification() {
      await this.resendVerification(this.user);
      this.$toast.success('Email de verificação reenviado com sucesso');
    },
    async handleVerification() {
      await this.verifyUser(this.user);
      this.$toast.success('Usuário verificado com sucesso');
      this.$emit('updated');
    },
    async handleChangePassword() {
      await this.blockUser(this.user);
      this.$toast.success('Link para troca de senha reenviado com sucesso');
    },
    async handleLoginAs(id) {
      await this.$auth.loginWith('admin', {
        data: {
          token: this.$auth.user.admin_token,
          id
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
// TODO move to a common layer (repeated from admin/user/index)
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
</style>
