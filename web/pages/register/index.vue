<template>
  <div>
    <div class="login">
      <div class="bg"></div>
      <form v-if="!$empty($v)">
        <h5 class="mb-4">Cadastre já!</h5>
        <form-input v-model="$v.credentials.name.$model" placeholder="Nome completo" icon="user"></form-input>
        <form-validation :active="$v.credentials.name.$error">O nome não pode estar vazio</form-validation>
        <form-email v-model="$v.credentials.email.$model" placeholder="Entre com seu email"></form-email>
        <form-validation :active="$v.credentials.email.$error">Por favor entre com um email válido</form-validation>
        <form-password v-model="$v.credentials.password.$model" placeholder="Crie uma senha para acessar a plataforma">
        </form-password>
        <form-validation :active="$v.credentials.password.$error">Senha não pode estar vazia</form-validation>
        <small class="px-4">Mínimo 8 caracteres, combinação de números, letras e caracteres especiais</small>
        <form-password v-model="$v.credentials.passwordConfirmation.$model" placeholder="Confirme sua senha"></form-password>
        <form-validation :active="$v.credentials.passwordConfirmation.$error">Confirmação deve ser igual a senha</form-validation>
        <form-checkbox v-model="credentials.accept_terms" class="my-4">
          Li e estou de acordo com os
          <u><nuxt-link class="ml-2" to="terms">Termos de Uso da plataforma</nuxt-link></u>
        </form-checkbox>
        <div v-if="error" class="mt-2 error">
          Problemas ao registrar sua conta
        </div>
        <div class="mb-4"></div>
        <div>
          <form-button class="mb-4" :disabled="$v.credentials.$invalid" @action="signup">Cadastrar</form-button>
          <facebook-login @granted="loginWithFacebook"></facebook-login>
          <google-login @granted="loginWithGoogle"></google-login>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Vuelidate from 'vuelidate'
import { required, email, sameAs } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'
import FacebookLogin from '@/components/auth/facebook'
import GoogleLogin from '@/components/auth/google'
import QueryString from 'query-string'
export default {
  components: {
    'facebook-login': FacebookLogin,
    'google-login': GoogleLogin
  },
  data() {
    return {
      credentials: {
        email: '',
        password: '',
        passwordConfirmation: '',
        name: '',
        accept_terms: false
      },
      error: null,
    }
  },
  validations: {
    credentials: {
      name: { required },
      email: { required, email },
      password: { required },
      passwordConfirmation: {
        sameAsPassword: sameAs('password')
      }
    }
  },
  computed: {
    termsAccepted() {
      return this.credentials.accept_terms
    },
    referralToken() {
      if (window === undefined) { return }
      const query = QueryString.parse(window.location.search)
      if (query.from !== undefined) {
        return { referral_token: query.from }
      }

      return {}
    },
    artistToken() {
      if (window === undefined) { return }
      const query = QueryString.parse(window.location.search)
      if (query.artist !== undefined) {
        return { artist_token: query.artist }
      }

      return {}
    }
  },
  methods: {
    ...mapActions('protected', ['register']),
    async signup() {
      this.$v.$touch()
      if (this.$v.credentials.$invalid) { 
        this.$toast.error('Formulário inválido ou faltando informação')
        return
      }

      if (!this.credentials.accept_terms) {
        this.$toast.error('Você precisa aceitar nossos termos de uso para se cadastrar')
        return
      }

      this.$auth.setToken('local', null)
      try {
        await this.register({ ...this.credentials, ...this.referralToken, ...this.artistToken })
        this.$router.push('/register/verify')
      } catch (error) {
        this.$sentry.captureException(error)
        this.error = error
      }
    },
    async loginWithFacebook(accessToken) {
      await this.$auth.loginWith('facebook', {
        data: {
          token: accessToken
        }
      })
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
    min-width: 30vw;
    background: transparent;
    box-shadow: $shadow;
    border-radius: $edges;

    input {
      width: 100%;
    }
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 110%;
    width: 100%;
    opacity: 0.2;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    margin-top: -10vh;

    &.artist {
      background-image: url('~assets/imgs/general/artist-signup.jpg');
    }

    &.contractor {
      background-image: url('~assets/imgs/general/contractor-signup.jpg');
    }
  }
}

small {
  font-weight: $bold;
  color: $layer5;
}
</style>
