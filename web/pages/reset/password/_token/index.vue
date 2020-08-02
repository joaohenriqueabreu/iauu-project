<template>
  <client-only>
    <main v-if="authorized" class="vertical center middle half-width pt-0">
      <h6>Digite uma nova senha de acesso a sua conta</h6>
      <form-password
        v-model="credentials.password"
        placeholder="Nova senha"
        class="half-width"
      ></form-password>
      <form-password
        v-model="credentials.passwordConfirm"
        placeholder="Confirme sua senha"
        class="half-width"
      ></form-password>
      <div class="mb-4"></div>
      <form-button @action="reset">Alterar senha</form-button>
    </main>
  </client-only>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  async asyncData({ app, store, route }) {
    try {
      await app.$axios.post('reset/authorize', { token: route.params.token })
      // ok, good to go
      return { authorized: true }
    } catch (error) {
      return { authorized: false }
    }
  },
  data() {
    return {
      credentials: {
        password: '',
        passwordConfirm: ''
      }
    }
  },
  mounted() {
    if (!this.authorized) {
      this.$toast.error('O token fornecido não é válido')
      setTimeout(this.handleUnauthorized, 5000)
    }
  },
  methods: {
    ...mapActions('protected', ['resetPassword']),
    ...mapActions('app', ['setAlert']),
    async reset() {
      try {
        await this.resetPassword({
          ...this.credentials,
          token: this.$route.params.token
        })
        this.$toast.success('Senha atualizada com sucesso. Por favor, faça login novamente.')
        await this.$utils.delay()
        this.$router.push('/login')
      } catch (error) {
        console.log(error)
        this.$toast.error('Não foi possível alterar sua senha')
      }
    },
    handleUnauthorized() {
      this.$router.push('/')
    }
  }
}
</script>

<style></style>
