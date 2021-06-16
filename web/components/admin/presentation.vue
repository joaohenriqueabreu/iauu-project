<template>
  <modal ref="modal">
    <template v-if="!$empty(presentation)" v-slot:header>
      <div class="d-flex justify-content-between">
        <div class="vertical middle">
          <h4 class="mb-2">{{ presentation.proposal.title }}</h4>
          <h6 class="status-badge mr-4" :class="presentation.status">{{ statusLabel }}</h6>
        </div>
        <div class="d-flex align-items-end">
          <h5 class="identifier">
            {{ presentation.status === 'proposal' ? 'Proposta' : 'Apresentação' }}
          </h5>
        </div>
      </div>
    </template>
    <template v-if="!$empty(presentation)" v-slot:main>
      <div>
        <h4 class="mb-4">Informações</h4>
        <div>ID</div>
        <h6 class="mb-4">{{ presentation.id }}</h6>
        <div class="vertical mb-4">
          <div>Contratante</div>
          <h6>{{ presentation.contractor.name }}</h6>
        </div>
        <div class="vertical mb-4">
          <div>Artista</div>
          <h6>{{ presentation.artist.name }}</h6>
        </div>
        <div v-if="presentation.status === 'proposal'">
          <div>Valor em negociação</div>
        </div>
        <div v-else></div>
        <div v-if="presentation.status === 'proposal'" class="mb-4">
          <div>Datas da proposta</div>
          <div class="horizontal">
            <div
              v-for="(timeslot, index) in presentation.proposal.timeslots"
              :key="index"
              class="vertical"
            >
              <h6 class="mr-2 horizontal">
                {{ timeslot.start_dt | datetime }}
                <span v-if="index < presentation.proposal.timeslots.length - 1">,</span>
              </h6>
            </div>
          </div>
        </div>
        <div v-else class="mb-4">
          <div>Data da apresentação</div>
          <div class="horizontal">
            <h6 class="mr-4">
              <icon icon="play-circle" class="mr-2"></icon>
              {{ presentation.timeslot.start_dt | datetime }}
            </h6>
            <h6>
              <icon icon="stop-circle" class="mr-2"></icon
              >{{ presentation.timeslot.end_dt | datetime }}
            </h6>
          </div>
        </div>
        <div v-if="presentation.status !== 'proposal'">
          <div>Contratado</div>
          <h6>{{ presentation.price | currency }}</h6>
          <h6>
            <icon icon="clock" class="mr-2"></icon>
            {{ presentation.duration }} horas
          </h6>
        </div>
      </div>
      <hr />
      <!-- <div>
        <h4 class="mb-4">Gerenciar</h4>
        <div class="row">
          <div class="col-sm-4 mb-4" v-if="['active', 'pending'].includes(user.status)">
            <form-button @action="handleBlockUser">Bloquear</form-button>
          </div>
          <div class="col-sm-4 mb-4" v-if="['blocked', 'pending'].includes(user.status)">
            <form-button @action="handleActivateUser">Ativar</form-button>
          </div>
          <div class="col-sm-4 mb-4" v-if="!isVerified">
            <form-button @action="handleVerification">Verificar usuário</form-button>
          </div>
          <div class="col-sm-4 mb-4">
            <form-button @action="handleChangePassword">Alterar de senha</form-button>
          </div>
        </div>
      </div> -->
    </template>
    <template v-if="!$empty(presentation)" v-slot:footer>
      <div class="horizontal center middle full-height">
        <form-button class="mr-4" @action="handleLoginAs(presentation.contractor.members[0].id)"
          >Fazer login como {{ presentation.contractor.name }}</form-button
        >
        <form-button @action="handleLoginAs(presentation.artist.members[0].id)"
          >Fazer login como {{ presentation.artist.name }}</form-button
        >
      </div>
    </template>
  </modal>
</template>

<script>
// import { mapActions } from 'vuex'
export default {
  props: {
    presentation: { type: Object, default: () => {} }
  },
  computed: {
    statusLabel() {
      if (this.presentation.status === 'proposal') {
        return 'Proposta'
      }
      if (this.presentation.status === 'rejected') {
        return 'Proposta recusada'
      }
      if (this.presentation.status === 'accepted') {
        return 'Apresentação contratada'
      }
      if (this.presentation.status === 'completed') {
        return 'Apresentação realizada'
      }
      if (this.presentation.status === 'cancelled') {
        return 'Apresentação cancelada'
      }
      return ''
    }
  },
  methods: {
    // ...mapActions('admin', ['blockUser', 'activateUser', 'resendVerification', 'verifyUser']),
    openModal() {
      this.$refs.modal.open()
    },
    async handleLoginAs(id) {
      await this.$auth.loginWith('admin', {
        data: {
          token: this.$auth.user.admin_token,
          id
        }
      })
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
