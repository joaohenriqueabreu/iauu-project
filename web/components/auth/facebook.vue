<script>
import SocialLogin from '@/components/auth/social'
export default {
  extends: SocialLogin,
  data() {
    return {
      name: 'Facebook',
      icon: ['fab', 'facebook']
    }
  },
  methods: {
    login() {
      this.$auth.loginWith('facebook')
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .button {
  background-color: #3b5998 !important;
  color: white;
}

.social-login {
  margin-bottom: 2 * $space;
}
</style>
