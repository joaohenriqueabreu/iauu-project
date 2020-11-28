<template>
  <div>
    <client-only>
      <div class="full-height" v-if="!verified">
        <div class="full-height vertical middle center">
          <h6 class="mb-2">Reenviar o link de verificação para seu email</h6>
          <small class="mb-4">Lembre-se que o link é válido por 24 horas</small>
          <form-button @action="resend">Enviar</form-button>
        </div>
      </div>
      <div v-else>
        <h6>Verificando sua conta...</h6>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      error: null
    }
  },
  computed: {
    ...mapState({ accessToken: (state) => state.protected.token })
  },
  async asyncData({ app, route }) {
    try {
      await app.$auth.loginWith('verify', {
        data: { token: route.params.token }
      });

      return { verified: true }
    } catch (error) {
      return { verified: false }
    }
  },
  async mounted() {
    if (this.verified) {
      await setTimeout(this.handleVerified, 3000);
      this.$router.push('/');
    } else {
      setTimeout(this.handleFailed, 3000);
    }
  },
  methods: {
    ...mapActions('protected', ['verify', 'resendVerify', 'release']),
    handleVerified() {
      this.$toast.success(`Conta verificada com sucesso! Bem vindo a ${this.$config.companyName}`);
    },
    handleFailed() {
      this.$toast.error('Seu token de verification é inválido ou está expirado.');
    },
    handleResend() {
      this.$router.push('/')
    },
    async resend() {
      await this.resendVerify(this.$route.params.token);
      this.$toast.info('Link enviado para seu email');
      setTimeout(this.handleResend, 3000);
    }
  }
}
</script>

<style></style>
