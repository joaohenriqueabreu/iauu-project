<template>
  <nav :class="theme" class="navbar d-flex justify-content-between">
    <div class="mainmenu vertical">
      <div v-if="$auth.loggedIn" class="horizontal mt-2">
        <product-setup v-if="$auth.hasScope('artist')" class="mr-3"></product-setup>
        <div class="dropdown">
          <a
            class="dropdown-toggle"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <overlay :rounded="true">
              <avatar :src="$auth.user.photo" :username="$auth.user.name"></avatar>
            </overlay>
          </a>
          <div class="dropdown-menu dropdown-menu-right submenu" aria-labelledby="dropdownMenuButton">
            <div v-if="$auth.hasScope('artist')">
              <nuxt-link to="/artist/schedule">
                <h5>{{ $auth.user.name }}</h5>
              </nuxt-link>
            </div>
            <admin-menu v-if="$auth.hasScope('admin')"></admin-menu>
            <artist-menu v-if="$auth.hasScope('artist')"></artist-menu>
            <contractor-menu v-if="$auth.hasScope('contractor')"></contractor-menu>
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
      displaySubmenu: false
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
  // @include mobile {
  //   height: 100vh;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   justify-content: center;

  //   h5 {
  //     margin-bottom: 5 * $space;
  //   }
  // }

  // @include desktop {
  //   display: flex;
  //   flex-direction: row;
  //   align-items: center;
  //   justify-content: flex-end;

  //   h5 {
  //     margin-bottom: 5 * $space;
  //   }
  // }

  // width: 100vw;
  // background: $layer1;
  // padding: 2 * $space;
  // position: relative;
  // height: 10vh;
  // align-items: flex-end;
  // justify-content: space-between;

  // transition: $transition;
}

.mainmenu {
  transition: $transition;
  padding-right: 4 * $space;
}
</style>