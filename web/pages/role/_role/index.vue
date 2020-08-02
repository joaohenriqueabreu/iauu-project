<template>
  <div>
    <modal ref="assign" height="tiny">
      <template v-slot:main>
        <div class="vertical center middle full-height">
          <h4>Estamos criando sua conta, aguarde por favor...</h4>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>
export default {
  async asyncData({ app, route }) {
    const { data } = await app.$axios.post('role', { role: route.params.role })
    app.$auth.setUserToken(data)
  },
  mounted() {
    this.$refs.assign.open()
    setTimeout(this.afterAssign(), 3000)
  },
  methods: {
    afterAssign() {
      this.$toast.success('Tudo pronto! Bem vindo a iauu')

      if (this.$auth.hasScope('artist')) {
        this.$router.push('/artist/schedule')
        return
      }

      if (this.$auth.hasScope('contractor')) {
        this.$router.push('/search')
        return
      }

      throw new Error('something is wrong')
    }
  }
}
</script>

<style></style>
