<template>
  <div>
    <notification v-if="$auth.user.requires_initial_setup" icon="exclamation-circle">
      <nuxt-link to="/artist/products">
        <h6>Você deve adicionar formatos de apresentação para começar a receber propostas</h6>
      </nuxt-link>
    </notification>
  </div>
</template>

<style lang="scss" scoped>
h6 {
  color: $layer2 !important;
}
</style>
