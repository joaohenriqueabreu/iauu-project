<template>
  <div>
    <div id="fb-root"></div>
    <form-button class="social-login" @action="login">
      <h6><font-awesome :icon="icon" class="mr-2"></font-awesome>Login com {{ name }}</h6>
    </form-button>
  </div>
</template>

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
  async mounted() {
    const d = document, s = "script", id = "facebook-jssdk";
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return;}
    js = d.createElement(s);
    js.id = id;
    // js.src = "https://connect.facebook.net/en_US/sdk.js";
    js.src = "https://connect.facebook.net/en_US/all.js";
    await fjs.parentNode.insertBefore(js, fjs);

    window.fbAsyncInit = await function() {
      window.FB.init({
        appId: process.env.FACEBOOK_CLIENT_ID,
        cookie: true, 
        // version: "v13.0"
        version: "v2.0"
      })
    }
  },
  methods: {
    async login() {
      const self = this
      if (this.$empty(window.FB)) { 
        self.$toast.error('Facebook plugin not ready. Try again in a couple of seconds.')
        return
      }

      window.FB.login((response) => {
        if (response.authResponse) {
          self.$emit('granted', response.authResponse.accessToken) 
        } else {
          self.$toast.error('Falha no login. Ação foi cancelada pelo usuário')
        }
      })

      return false
    },
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
