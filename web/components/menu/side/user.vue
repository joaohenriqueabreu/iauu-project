<script>
export default {
  props: {
    minimized: { type: Boolean, default: true }
  },
  methods: {
    routed(option) {
      return this.$route.path.split('/').includes(option)
    }
  }
}
</script>

<style lang="scss">
.side-menu-items {
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
      // margin-bottom: 10 * $space;
      transition: $transition;
      color: $brand;
      padding: 5 * $space;
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
}

</style>