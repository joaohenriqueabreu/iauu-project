<template>
  <nav class="navbar d-flex justify-content-end">
    <div>
      <top-menu></top-menu>
    </div>
  </nav>
</template>

<script>
import TopMenu from '@/components/menu/top'
export default {
  components: {
    'top-menu': TopMenu
  }
}
</script>

<style></style>
