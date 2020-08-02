<template>
  <div>
    <header class="horizontal center middle">
      <nuxt-link v-show="!minimized" to="/">
        <logo :height="50" :width="50"></logo>
      </nuxt-link>
      <div class="hide-mobile hide-menu">
        <font-awesome
          class="minimize"
          :icon="minimized ? 'angle-double-right' : 'angle-double-left'"
          @click="minimize">
        </font-awesome>
      </div>
    </header>
    <main>
      <admin-menu v-if="$auth.hasScope('admin')" :minimized="minimized"></admin-menu>
      <artist-menu v-if="$auth.hasScope('artist')" :minimized="minimized"></artist-menu>
      <contractor-menu v-if="$auth.hasScope('contractor')" :minimized="minimized"></contractor-menu>
    </main>
  </div>
</template>

<script>
import Logo from '@/components/layout/logo'
import AdminMenu from '@/components/menu/side/admin'
import ArtistMenu from '@/components/menu/side/artist'
import ContractorMenu from '@/components/menu/side/contractor'
export default {
  components: {
    AdminMenu,
    ArtistMenu,
    ContractorMenu
  },
  data() {
    return {
      minimized: true
    }
  },
  methods: {
    minimize() {
      this.minimized = !this.minimized
      this.$emit('minimize', this.minimized)
    },
  }
}
</script>

<style lang="scss" scoped>
.logo {
  margin-left: 0;
  margin-right: 2 * $space;
}

.minimize {
  color: $layer5;
  cursor: pointer;
}

[data-icon] {
  font-size: $huge;
}

main {
  background: none !important; // override main.scss
  box-shadow: none !important; // override main.scss
}

@include desktop {
  div {
    display: flex;
    flex-direction: column;
  }
  header {
    padding-top: 20px;
    height: 20vh;

    .hide-menu {
      background: $layer1;
      position: absolute;
      padding-left: 20px;
      padding: 10px;
      top: 5px;
      right: -40px;
      text-align: center;
    }
  }

  main {
    height: 70vh;
    a {
      padding: 5 * $space 2 * $space 4 * $space 3 * $space;
    }
  }

  footer {
    height: 10vh;
  }

  a {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 2 * $space;
    transition: $transition;
    color: $brand;
    padding: 0 4 * $space;
    width: 100%;
    // border-top-right-radius: $rounded;
    // border-bottom-right-radius: $rounded;

    &.previous {
      border-bottom-right-radius: $rounded;
    }

    &.later {
      border-top-right-radius: $rounded;
    }

    &.routed {
      background: $layer2;
    }

    &:hover {
      transition: $transition;
      color: $layer4;
    }
  }
}

@include mobile {
  aside {
    width: 100vw;
    div {
      width: 100%;
    }
  }
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  a {
    margin-right: 4 * $space;
  }

  header,
  footer,
  span,
  hr {
    display: none;
  }
}
</style>
