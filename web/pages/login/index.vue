<template>
  <client-only>
    <div class="login">
      <div v-if="validationInitialized">
        <div class="bg" :style="`background-image: url('${$images('concert.png')}');`"></div>
        <form>
          <h5 class="mb-4">Entre</h5>
          <form-email v-model="$v.credentials.email.$model"></form-email>
          <form-validation :error="$v.credentials.email.$error">Por favor entre com um email válido</form-validation>
          <form-password v-model="$v.credentials.password.$model"></form-password>
          <form-validation :error="$v.credentials.password.$error">Senha não pode estar vazia</form-validation>
          <div class="mb-2"></div>
          <div class="forgot-password" @click="openForgotPasswordModal">
            <span>Esqueceu sua senha?</span>
          </div>
          <div class="mb-5"></div>
          <form-button ref="login" @action="login">Login</form-button>
          <div class="mb-5"></div>
          <facebook-login @granted="loginWithFacebook"></facebook-login>
          <google-login @granted="loginWithGoogle"></google-login>
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
              <form-validation :error="$utils.empty(forgotPasswordForEmail)">
                Entre com um email válido
              </form-validation>
            </div>
          </template>
          <template v-slot:footer>
            <div class="half-width">
              <form-button :disabled="$utils.empty(forgotPasswordForEmail)" @action="sendForgotPassword">Enviar</form-button>
            </div>
          </template>
        </modal>
      </div>
    </div>
  </client-only>
</template>

<script>
import Vuelidate from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
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
      forgotPasswordForEmail: ''
    }
  },
  validations: {
    credentials: {
      email: { required, email },
      password: { required }
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

    this.$router.push(`/login/social?icon=${this.$route.query.code}`)
  },
  computed: {
    validationInitialized() {
      return !this.$empty(this.$v)
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    ...mapActions('protected', ['forgotPassword']),
    async login() {
      this.$v.$touch();
      if (this.$v.credentials.$invalid) { 
        this.$toast.error('Formulário inválido');
        return;
      }

      try {
        await this.$auth.loginWith('user', { data: this.credentials });

        this.$router.push('/artist/schedule');
      } catch (error) {
        this.$toast.error('Email ou senha inválidos');
      }
    },
    async loginWithFacebook(accessToken) {
      await this.$auth.loginWith('facebook', { data: { token: accessToken }})
    },
    async loginWithGoogle(accessToken) {
      await this.$auth.loginWith('google', { data: { token: accessToken, provider: 'google'}})
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
form {
  position: relative;
  z-index: $above;
}

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
    height: 100%;
    width: 100%;
    opacity: 0.2;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 0;
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
