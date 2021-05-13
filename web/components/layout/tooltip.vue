<template>
  <div>
    <v-popover>
      <slot></slot>
    </v-popover>
  </div>
</template>

<script>
import { VPopover } from 'v-tooltip';
export default {
  components: {
    VPopover
  }
}
</script>

<style>

</style>