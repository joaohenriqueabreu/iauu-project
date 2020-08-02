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
      <small>Não se preocupe, somente com sua autorização, suas informações serão compartilhadas</small>
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
    <form-button @action="saveProfile">Salvar</form-button>
  </footer>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import FacebookLogin from '@/components/auth/facebook'
import GoogleLogin from '@/components/auth/google'
export default {
  async asyncData({ app, store, error, $sentry }) {
    try {
      await store.dispatch('contractor/loadContractor')
    } catch (e) {
      $sentry.captureException(e)
      error({ statusCode: 404, message: 'Perfil não encontrado' })
    }
  },
  components: {
    'facebook-login': FacebookLogin,
    'google-login': GoogleLogin
  },
  data() {
    return {
      data: ''
    }
  },
  computed: {
    ...mapState({ contractor: (state) => state.contractor.contractor }),
    ...mapFields('contractor', {
      name: 'contractor.user.name',
      phone: 'contractor.phone'
    }),
    avatarImg() {
      return !this.$utils.empty(this.contractor.user.photo)
        ? this.contractor.user.photo
        : this.$config.defaultAvatarImgUrl
    }
  },
methods: {
    ...mapActions('contractor', ['saveProfile']),
    ...mapMutations('contractor', { updateProfile: 'update_profile' }),
    uploadAvatar() {
      this.$refs.avatarUploader.upload()
    },
    async setAvatar({ url }) {
      this.updateProfile({ prop: 'user.photo', data: url })
      await this.saveProfile()
    }
  }
}
</script>

<style>

</style>