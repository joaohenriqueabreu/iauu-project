<template>
  <div>
    <form @submit.prevent="saveProfile">
      <image-uploader ref="bgUploader" @uploaded="setBackground" resolution="background">
        <header :style="{ 'background-image': `url(${$images(backgroundImg)})` }" @click="uploadBG"></header>
      </image-uploader>
      <main>
        <div class="logo">
          <image-uploader ref="avatarUploader" :rounded="true" @uploaded="setAvatar">
            <avatar :src="avatarImg" :size="150" @click="uploadAvatar"></avatar>
          </image-uploader>
        </div>
        <div class="pt-5"></div>
        <div class="boxed full-width">
          <div class="">
            <ul class="horizontal horizontal-scroll mt-4 pl-0">
              <li class="nav-link" :class="{ active: statsTab }" @click="activeTab = 'stats'"><h6>Geral</h6></li>
              <li class="nav-link" :class="{ active: infoTab }" @click="activeTab = 'info'"><h6>Informações</h6></li>
              <li class="nav-link" :class="{ active: presentationsTab }" @click="activeTab = 'presentations'"><h6>Apresentações</h6></li>
              <li class="nav-link" :class="{ active: catTab }" @click="activeTab = 'categories'"><h6>Estilo</h6></li>
              <li class="nav-link" :class="{ active: typesTab }" @click="activeTab = 'types'"><h6>Eventos</h6></li>
              <li class="nav-link" :class="{ active: socialTab }" @click="activeTab = 'social'"><h6>Redes Sociais</h6></li>
              <li class="nav-link" :class="{ active: usersTab }" @click="activeTab = 'users'"><h6>Integrantes</h6></li>              
              <li v-if="arePaymentsEnabled" class="nav-link" :class="{ active: bankAccountTab }" @click="activeTab = 'bankAccount'"><h6>Dados bancários</h6></li>
            </ul>
          </div>
          <div class="mb-5 raised vertical middle" :class="{ first: statsTab }">
            <fade-transition mode="out-in">
              <profile-stats v-if="statsTab" key="stats"></profile-stats>
            </fade-transition>
            <fade-transition mode="out-in">
              <presentation-config v-show="presentationsTab" ref="presentations"></presentation-config>
            </fade-transition>
            <fade-transition mode="out-in">
              <artist-members v-if="!$empty(shareableId)" v-show="usersTab" :role-id="shareableId" ref="users" key="users"></artist-members>
            </fade-transition>
            <fade-transition mode="out-in">
              <artist-info v-if="infoTab" ref="info"></artist-info>
            </fade-transition>
            <fade-transition mode="out-in">
              <social-networks v-if="socialTab" ref="social" key="social"></social-networks>
            </fade-transition>
            <fade-transition mode="out-in">
              <artist-categories v-if="catTab" key="categories" :categories="categories"></artist-categories>
            </fade-transition>
            <fade-transition mode="out-in">
              <presentation-types v-if="typesTab" :options="presentationTypes" key="types"></presentation-types>
            </fade-transition>
            <fade-transition mode="out-in">
              <bank-account v-if="bankAccountTab" key="bankAccount" @bank-account-changed="validateBankAccount"></bank-account>
            </fade-transition>
          </div>
        </div>
      </main>
      <footer v-if="!bankAccountTab">
        <div class="half-width">
          <h6 class="hide-mobile text-center mb-3">Clique aqui para salvar suas alterações no perfil</h6>
          <form-button @action="saveArtistProfile">Salvar</form-button>
        </div>
      </footer>
    </form>
  </div>
</template>

<script>
import { mapFields }                          from 'vuex-map-fields';
import { mapActions, mapState, mapMutations } from 'vuex';
import ProfileStats                           from '@/components/artist/profile/stats';
import ArtistInfo                             from '@/components/artist/profile/info';
import PresentationConfig                     from '@/components/artist/profile/presentationsConfig';
import ArtistMembers                          from '@/components/artist/profile/members';
import SocialNetworks                         from '@/components/artist/profile/social';
import ArtistCategories                       from '@/components/artist/profile/categories';
import PresentationTypes                      from '@/components/artist/profile/presentationTypes';
import BankAccount                            from '@/components/artist/profile/bankAccount';
export default {
  components: {
    ProfileStats,
    PresentationConfig,
    ArtistInfo,
    ArtistMembers,
    SocialNetworks,
    ArtistCategories,
    PresentationTypes,
    BankAccount,
  },
  async asyncData({ app, store, error, $sentry }) {
    try {
      await store.dispatch('artist/loadArtistPrivateProfile');
      const catResponse = await app.$axios.get('categories');
      const presentationTypesResponse = await app.$axios.get('presentations/types');
      const roleIdResponse = await app.$axios.get('/users/exchange');
      return { 
        categories:         catResponse.data,
        presentationTypes:  presentationTypesResponse.data,
        shareableId:        roleIdResponse.data
      }
    } catch (e) {
      $sentry.captureException(e)
      error({ statusCode: 404, message: 'Perfil não encontrado' });
    }
  },
  data() {
    return {
      activeTab: { type: String, default: 'stats' },
      validBankAccount: false,
      bankAccount: {}
    }
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    ...mapFields('artist', {
      photo: 'artist.photo',
      background: 'artist.background'
    }),
    statsTab()          { return this.activeTab === 'stats'; },
    presentationsTab()  { return this.activeTab === 'presentations'; },
    infoTab()           { return this.activeTab === 'info'; },
    usersTab()          { return this.activeTab === 'users'; },
    socialTab()         { return this.activeTab === 'social'; },
    catTab()            { return this.activeTab === 'categories'; },
    typesTab()          { return this.activeTab === 'types'; },
    bankAccountTab()    { return this.activeTab === 'bankAccount'; },
    backgroundImg() { 
      return !this.$utils.empty(this.background)
        ? this.background
        : this.$config.defaultBGImgUrl;
    },
    avatarImg() {
      return !this.$utils.empty(this.photo) ? this.photo : this.$config.defaultAvatarImgUrl
    },
    arePaymentsEnabled() {
      return process.env.paymentsEnabled === 'true';
    }
  },
  created() {
    this.profile = this.$object.clone(this.artist);
    this.activeTab = 'stats';
    console.log(process.env.paymentsEnabled);
  },
  methods: {
    ...mapActions('artist', ['saveProfile']),
    uploadBG() {
      this.$refs.bgUploader.upload();
    },
    uploadAvatar() {
      this.$refs.avatarUploader.upload();
    },
    categorySelect(category) {
      alert(category);
    },
    validateBankAccount(valid, bankAccount) {
      this.validBankAccount = valid;
      this.bankAccount = bankAccount;
    },
    async setBackground({ url }) {
      this.background = url;
      await this.saveProfile();
      this.$toast.success('Background atualizado');
    },
    async setAvatar({ url }) {
      this.photo = url;
      await this.saveProfile();
      this.$toast.success('Foto atualizada');
    },
    async saveArtistProfile() {
      // Special handling for bank account
      try {
        await this.saveProfile();
        this.$toast.success('Perfil atualizado com sucesso');
      } catch (error) {
        this.$toast.error('Tivemos um problema ao salvar o perfil');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
form {
  header {
    height: 30vh;
    background-size: cover;
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  main {
    @extend .vertical, .center, .middle;
    position: relative;
    padding-bottom: 10 * $space;
    .logo {
      position: absolute;
      top: -75px;
      z-index: $above;
    }

    .boxed {
      @extend .vertical, .middle;
      background: $layer3;
      box-shadow: $shadow;
      border-radius: $edges;
      padding: 5 * $space;
      position: relative;
      z-index: $base;

      ul {
        // background: $layer4;
        margin-bottom: 0;
        padding-left: 0;
        z-index: $above;
        border-top-left-radius: $edges;
        border-top-right-radius: $edges;

        li {
          padding-top: 2 * $space;
          padding-bottom: 2 * $space;
          z-index: $above;
          min-width: 100px;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          margin-right: 2 * $space;

          transition:   $transition;
          &:hover {
            transition: $transition;
            color:      $brandLayer;
          }

          &.active {
            background:               $layer4;
            border-top-left-radius:   $edges;
            border-top-right-radius:  $edges;
            padding:                  2 * $space;
          }
        }
        
      }

      .raised {
        transition: $transition;
        background: $layer4;
        padding: 4 * $space;
        box-shadow: $shadow;
        width: 100%;
        border-radius: $edges;
        min-height: 50vh;
        border-radius: $edges;
        &.first {
          border-radius: 0 $edges $edges $edges; 
        }

        // &.first {
        //   border-radius: 0 $edges $edges $edges;
        // }
      }
    }

    .vue-avatar--wrapper {
      box-shadow: $shadow;
    }
  }

  footer {
    height:     10vh;
    position:   fixed;
    bottom:     0;
    left:       0;
    right:      0;
    background: $layer1;
    padding:    2 * $space;   
    @include desktop() {
      padding-left: 15vw; // follow side menu 
    }    
  }

  // Overwrite bootstrap styling
  .nav-tabs {
    border-bottom: none;
    z-index: $above;
    .nav-link {
      padding-bottom: 0;
      border: none;
      border-top-left-radius: $edges;
      border-top-right-radius: $edges;
      cursor: pointer;
      transition: $transition;

      &.first {
        padding-left: 0;
        padding-right: 0;
      }

      &.active {
        background: $layer4;
        border: none;
        color: $brand;
        box-shadow: 0 -19px 19px 2px rgba(0, 0, 0, 0.1);
      }

      &:hover {
        transition: $transition;
        color: $layer5;
      }
      a {
        padding-bottom: 2 * $space;
      }
    }
  }
}
</style>
