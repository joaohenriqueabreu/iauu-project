<template>
  <div class="full-height">
    <div class="full-height vertical middle center">
      <h6 class="mb-2">Reenviar o link de verificação para seu email</h6>
      <small class="mb-4">Lembre-se que o link é válido por 24 horas</small>
      <form-button @action="resend">Enviar</form-button>
    </div>
    <modal ref="verify" height="tiny">
      <template v-slot:main>
        <div class="vertical center middle full-height">
          <h6>Verificando sua conta, aguarde por favor...</h6>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      verified: false,
      error: null
    }
  },
  computed: {
    ...mapState({ accessToken: (state) => state.protected.token })
  },
  async mounted() {
    this.$refs.verify.open()
    try {
      await this.verify(this.$route.params.token)
      this.$auth.setUserToken(this.accessToken)

      setTimeout(this.handleVerified, 3000)
    } catch (error) {
      this.error = error
      setTimeout(this.handleFailed, 3000)
    }
  },
  methods: {
    ...mapActions('protected', ['verify', 'resendVerify', 'release']),
    handleVerified() {
      this.$toast.success('Conta verificada com sucesso! Bem vindo a Iauu')
      const self = this
      setTimeout(() => self.$router.push('/'), 3000)
    },
    handleFailed() {
      this.$toast.error('Seu token de verification é inválido ou está expirado.')
      this.$refs.verify.close()
    },
    handleResend() {
      this.$router.push('/')
    },
    async resend() {
      await this.resendVerify(this.$route.params.token)
      this.$toast.info('Link enviado para seu email')
      setTimeout(this.handleResend, 3000)
    }
  }
}
</script>

<style></style>
