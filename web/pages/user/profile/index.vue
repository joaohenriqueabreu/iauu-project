<template>
  <div>
    <main>
      <h5 class="mb-4">Atualize seu perfil</h5>
      <div class="horizontal middle mb-4">
        <div class="mr-5">
          <image-uploader ref="avatarUploader" :rounded="true" @uploaded="setAvatar">
            <avatar :src="avatarImg" :size="150" @click="uploadAvatar"></avatar>
          </image-uploader>
        </div>
        <div class="full-width">
          <form-input v-model="name" icon="user" label="Nome"></form-input>
        </div>
      </div>
      <div class="boxed mb-4">
        <h6>Atualize suas informações pessoais</h6>
        <small
          >Não se preocupe, somente com sua autorização, suas informações serão
          compartilhadas</small
        >
        <form-masked v-model="phone" icon="phone" placeholder="Telefone" mask="phone"></form-masked>
      </div>
      <div class="boxed">
        <h6>Conecte suas redes sociais</h6>
        <div class="my-4 vertical half-width">
          <facebook-login></facebook-login>
          <google-login></google-login>
        </div>
      </div>
    </main>
    <footer class="full-width m-4 horizontal center middle">
      <form-button @action="handleSaveUserProfile">Salvar</form-button>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import FacebookLogin from '@/components/auth/facebook'
import GoogleLogin from '@/components/auth/google'
export default {
  components: {
    'facebook-login': FacebookLogin,
    'google-login': GoogleLogin
  },
  async asyncData({ app, store, error, $sentry }) {
    try {
      await store.dispatch('protected/loadUser')
    } catch (e) {
      $sentry.captureException(e)
      error({ statusCode: 404, message: 'Perfil não encontrado' })
    }
  },
  data() {
    return {
      data: ''
    }
  },
  computed: {
    ...mapState({ user: (state) => state.protected.user }),
    ...mapFields('protected', {
      name: 'user.name',
      phone: 'user.phone',
      email: 'user.email',
      photo: 'user.photo',
    }),
    avatarImg() {
      return !this.$utils.empty(this.photo)
        ? this.photo
        : this.$config.defaultAvatarImgUrl
    }
  },
  methods: {
    ...mapActions('protected', ['renewAuth', 'saveProfile']),
    uploadAvatar() {
      this.$refs.avatarUploader.upload()
    },
    async handleSaveUserProfile() {
      await this.saveProfile()
      this.$toast.success('Perfil salvo com sucesso!')
    },
    async setAvatar({ url }) {
      this.photo = url
      await this.saveProfile()
      await this.renewAuth()
      this.$toast.success('Foto atualizada!')
    }
  }
}
</script>

<style></style>
