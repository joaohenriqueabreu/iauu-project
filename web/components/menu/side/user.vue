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
  height: 100%;

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
      margin: 4 * $space 0;
      padding: 2 * $space 5 * $space;
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
        color:          $brandLayer;
        border-left:    5px solid $brandLayer;
        &:hover {
          transition:   $transition;
          color:        $layer5;  
          border-left:  5px solid $layer5;
        }
      }

      &:hover {
        transition:   $transition;
        color:        $brandLayer;
        border-left:  5px solid $brandLayer;
      }
    }
  }

  @include mobile {
      display:          flex;
      flex-direction:   row;
      align-items:      center;
      justify-content:  center;

    aside {
      width: 100vw;
      div {
        width: 100%;
      }
    }

    div {
      display:          flex;
      flex-direction:   row;
      align-items:      center;
      justify-content:  center;
      height: 100%
    }

    a {
      margin: 0 2 * $space;
      padding: 0 2 * $space;
      height: 50%;
      text-align: center;
      [data-icon] { margin-right: 0; }

      &.routed {
        color: $brandLayer;
        border-bottom: 5px solid $brandLayer;
      }
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
