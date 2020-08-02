<template>
  <div>
    <modal ref="loading" height="tiny">
      <template v-slot:main>
        <div class="vertical center middle">
          Estamos validando seu login...
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
import QueryString from 'query-string'

export default {
  props: {
    network: { type: String, default: null }
  },
  async mounted() {
    this.$refs.loading.open()
    const { access_token: accessToken } = QueryString.parse(window.location.hash)
    const { data } = await this.$axios.post(`login/${this.network}`, { token: accessToken })
    this.$toast.success('Login verificado com sucesso!')

    this.$auth.setToken('local', `Bearer ${data}`)
    await this.$auth.setStrategy('local')
    await this.$auth.fetchUser()
  }
}
</script>
