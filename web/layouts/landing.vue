<template>
  <div :class="theme" class="page">
    <header>
      <nav>
        <h1>this is a header</h1>
      </nav>
    </header>
    <main>
      <nuxt />
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({ theme: (state) => state.layout.theme })
  }
}
</script>

<style lang="scss">

</style>
