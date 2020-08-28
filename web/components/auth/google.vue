<script>
import SocialLogin from '@/components/auth/social'
export default {
  extends: SocialLogin,
  data() {
    return {
      name: 'Google',
      icon: ['fab', 'google']
    }
  },
  methods: {
    async login() {
      const googleUser = await this.$gAuth.signIn()
      this.$emit('granted', googleUser.getAuthResponse().access_token)
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .button {
  background-color: #dd4b39 !important;
  color: white;
}

.social-login {
  margin-bottom: 2 * $space;
}
</style>
