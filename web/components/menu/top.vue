<template>
  <nav :class="{ filled: scrolled }" class="navbar d-flex justify-content-end">
    <div class="mainmenu vertical">
      <div v-if="$auth.loggedIn" class="horizontal mt-2">
        <product-setup v-if="$auth.hasScope('artist')" class="mr-3"></product-setup>
        <div class="dropdown" data-test="top-menu">
          <a class="dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <overlay :rounded="true">
              <avatar :src="$auth.user.photo" :username="$auth.user.name"></avatar>
            </overlay>
          </a>
          <div class="dropdown-menu dropdown-menu-right submenu" aria-labelledby="dropdownMenuButton">
            <div class="horizontal middle">
              <nuxt-link :to="userRoleDefaultRedirect" class="horizontal middle">
                <avatar :src="$auth.user.photo" :username="$auth.user.name" class="mr-4"></avatar>
                <div class="vertical full-height middle">
                  <h5 class="mb-1">{{ $auth.user.name }}</h5>
                  <small>{{ userRoleLabel }}</small>
                </div>
              </nuxt-link>
            </div>
            <hr>
            <admin-menu v-if="$auth.hasScope('admin')"></admin-menu>
            <artist-menu v-if="$auth.hasScope('artist')"></artist-menu>
            <contractor-menu v-if="$auth.hasScope('contractor')"></contractor-menu>
            <nuxt-link to="/user/profile">
              <h6>Perfil</h6>
            </nuxt-link>
            <nuxt-link to="/logout">
              <h6>Sair</h6>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div v-else key="guest" class="guest">
        <nuxt-link to="/register">
          <h5 class="mr-5">Cadastre-se</h5>
        </nuxt-link>
        <nuxt-link to="/login">
          <h5>Login</h5>
        </nuxt-link>
      </div>
    </div>
  </nav>
</template>

<script>
import ProductSetup from '@/components/artist/productSetup'
import AdminMenu from '@/components/menu/top/admin'
import ArtistMenu from '@/components/menu/top/artist'
import ContractorMenu from '@/components/menu/top/contractor'
export default {
  components: {
    ProductSetup,
    AdminMenu,
    ArtistMenu,
    ContractorMenu
  },
  data() {
    return {
      displaySubmenu: false,
      scrolled: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollY)
  },
  computed: {
    userRoleDefaultRedirect() {
      if (this.$auth.hasScope('artist')) { return '/artist/schedule' }
      if (this.$auth.hasScope('contractor')) { return '/contractor/presentations' }
      if (this.$auth.hasScope('admin')) { return '/admin/dashboard' }
      return '/'
    },
    userRoleLabel() {
      if (this.$auth.hasScope('artist')) { return 'Artista' }
      if (this.$auth.hasScope('contractor')) { return 'Organizador de eventos' }
      if (this.$auth.hasScope('admin')) { return 'Admin' }
      return ''
    }
  },
  methods: {
    scrollY(event) {
      this.scrolled = window.scrollY > 50
    }
  },
  watch: {
    $route(to, from) {
      this.displaySubmenu = false
    }
  }
}
</script>

<style lang="scss" scoped>
.menu {
  @extend .vertical, .middle;
  position: absolute;
  top: 0;
  right: 0;
  align-items: flex-end;
  @include desktop {
    max-height: 10vh;
  }
}

small {
  color: $layer5;
  font-weight: $bold;
}

h6 {
  font-weight: $bold;
  margin-bottom: 2 * $space;
  margin-right: 5 * $space;
}

.guest {
  @extend .horizontal, .middle;
  padding-right: 2 * $space;
  height: 10vh;
}

.submenu {
  background: $layer1;
  color: $brand;
  box-shadow: $shadow;
}

.mainmenu {
  transition: $transition;
  padding-right: 4 * $space;
}

.navbar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  transition: $transition;
  z-index: $above;
  &.filled {
    transition: $transition;
    background: $layer1;
  }
}

.dropdown-menu {
  padding: 2 * $space;
}
</style>