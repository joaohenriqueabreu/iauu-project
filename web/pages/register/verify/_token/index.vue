<template>
  <div>
    <client-only>
      <div v-if="verifying">
        <h6>Verificando sua conta...</h6>
      </div>
      <div class="full-height" v-if="!verified && !verifying">
        <div class="full-height vertical middle center">
          <h6 class="mb-2">Reenviar o link de verificação para seu email</h6>
          <small class="mb-4">Lembre-se que o link é válido por 24 horas</small>
          <form-button @action="resend">Enviar</form-button>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      verifying:  true,
      verified:   false,
      error:      null
    }
  },
  computed: {
    ...mapState({ accessToken: (state) => state.protected.token })
  },  
  async mounted() {
    try {
      this.$toast.info('Verificando sua conta');
      await this.verify(this.$route.params.token);
      setTimeout(this.handleVerified, 3000);      
    } catch (error) {
      this.$toast.error('Seu token de verification é inválido ou está expirado.');
      this.verifying  = false;
    }
  },
  methods: {
    ...mapActions('protected', ['verify', 'resendVerify', 'release']),
    handleVerified() {
      this.verified   = true;
      this.verifying  = false;
      this.$toast.success(`Conta verificada com sucesso! Bem vindo a ${this.$config.companyName}.`);
      this.$toast.success('Por favor faca login para comecar a usar a plataforma');
      this.$router.push('/login');
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
