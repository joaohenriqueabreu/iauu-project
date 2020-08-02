<template>
  <div>
    <div class="dropdown">
      <a
        id="dropdownMenuLink"
        class="dropdown-toggle"
        href="#"
        role="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <font-awesome :icon="icon"></font-awesome>
      </a>
      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
        <slot class="dropdown-item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: { type: String, default: 'coffee' }
  }
}
</script>

<style lang="scss" scoped>
[data-icon] {
  margin-top: 2 * $space;
  color: $brandLayer;
  border-radius: $rounded;
  box-shadow: $shadow;
  font-size: $huge;
  transition: $transition;

  &:hover {
    transition: $transition;
    color: $brand;
  }
}
</style>

<style lang="scss">
// Overwrite bootstrap style
.dropdown {
  .dropdown-toggle {
    &:after {
      display: none;
    }
  }

  .dropdown-menu {
    width: 250px;
    padding: 2 * $space;
    .dropdown-item {
      color: $layer2 !important;
    }
  }
}
</style>
