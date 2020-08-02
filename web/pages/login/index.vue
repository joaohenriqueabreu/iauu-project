<template>
  <div class="login">
    <div class="bg"></div>
    <form>
      <h5>Entre</h5>
      <form-email v-model="credentials.email" @input="resetError"></form-email>
      <form-password v-model="credentials.password" @input="resetError"></form-password>
      <form-validation :active="hasError">Usuário ou senha inválidos</form-validation>
      <div class="mb-2"></div>
      <div class="forgot-password" @click="openForgotPasswordModal">
        <span>Esqueceu sua senha?</span>
      </div>
      <div class="mb-5"></div>
      <form-button ref="login" @action="login">Login</form-button>
      <div class="mb-5"></div>
      <facebook-login></facebook-login>
      <google-login></google-login>
    </form>
    <modal ref="forgotPassword" height="tiny">
      <template v-slot:header>
        <div class="vertical middle center">
          <h4>Esqueceu sua senha?</h4>
        </div>
      </template>
      <template v-slot:main>
        <div class="vertical middle center">
          <span>Entre com o seu email para solicitar uma nova senha</span>
          <form-email v-model="forgotPasswordForEmail" class="full-width px-5"></form-email>
          <form-validation :active="$utils.empty(forgotPasswordForEmail)"
            >Entre com um email válido</form-validation
          >
        </div>
      </template>
      <template v-slot:footer>
        <div class="half-width">
          <form-button :disabled="$utils.empty(forgotPasswordForEmail)" @action="sendForgotPassword"
            >Enviar</form-button
          >
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import FacebookLogin from '@/components/auth/facebook'
import GoogleLogin from '@/components/auth/google'
export default {
  middleware: ['guest'],
  components: {
    'facebook-login': FacebookLogin,
    'google-login': GoogleLogin
  },
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      },
      forgotPasswordForEmail: '',
      hasError: false
    }
  },
  created() {
    const { name } = this.$auth.strategy
    if (
      this.$utils.empty(this.$route.query.code) ||
      this.$utils.empty(name) ||
      !['facebook', 'google'].includes(name)
    ) {
      return
    }

    this.$router.push(`/login/social?code=${this.$route.query.code}`)
  },
  methods: {
    ...mapActions('auth', ['login']),
    ...mapActions('protected', ['forgotPassword']),
    async login() {
      try {
        await this.$auth.loginWith('user', {
          data: this.credentials
        })
        this.$router.push('/artist/schedule')
      } catch (error) {
        console.log(error)
        this.hasError = true
        this.$refs.login.reset()
      }
    },
    resetError() {
      this.hasError = false
    },
    openForgotPasswordModal() {
      this.$refs.forgotPassword.open()
    },
    sendForgotPassword() {
      this.$toast.info(
        'Solicitação enviada! Se o email estiver em nossas bases, enviaremos as instruções para troca de senha. Obrigado'
      )

      setTimeout(this.handleResetPassword, 5000)
    },
    async handleResetPassword() {
      await this.forgotPassword(this.forgotPasswordForEmail)
      this.$refs.forgotPassword.close()
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  @extend .vertical, .middle, .center;
  position: relative;
  height: 100vh;

  form {
    @extend .vertical, .middle;
    padding: 3 * $space;
    z-index: $above;
    min-height: 50vh;
    min-width: 25vw;
    background: $layer2;
    box-shadow: $shadow;

    input {
      width: 100%;
    }
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    background-image: url('~assets/imgs/concert.png?webp');
    height: 100%;
    width: 100%;
    opacity: 0.2;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}

.forgot-password {
  @extend .horizontal, .middle, .center, .clickable;

  span {
    color: $layer5;
    transition: $transition;
    &:hover {
      transition: $transition;
      color: $brand;
    }
  }
}
</style>
