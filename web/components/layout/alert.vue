<template>
  <div></div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({ alert: (state) => state.app.alert }),
    ...mapState({ newAlert: (state) => state.app.newAlert })
  },
  watch: {
    newAlert(value) {
      console.log('triggered something')
      if (!this.$utils.empty(this.alert.message)) {
        this.showAlert()
      }
    }
  },
  mounted() {
    const alert = window.localStorage.getItem('alert')
    if (!this.$utils.empty(this.alert.message) || !this.$utils.empty(alert)) {
      this.showAlert()
    }
  },
  methods: {
    ...mapActions('app', ['setAlert', 'clearAlert']),
    showAlert() {
      if (this.alert.type === 'success') {
        this.$toast.success(this.alert.message)
      }

      if (this.alert.type === 'error') {
        this.$toast.error(this.alert.message)
      }

      if (this.alert.type === 'info') {
        this.$toast.info(this.alert.message)
      }

      setTimeout(this.clearAlert, 5000)
    }
  }
}
</script>

<style lang="scss">
@import 'sweetalert2/dist/sweetalert2.min.css';
</style>

<style lang="scss" scoped></style>
