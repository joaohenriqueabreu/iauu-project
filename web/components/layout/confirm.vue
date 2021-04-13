<template>
  <div></div>
</template>
<script>
export default {
  props: {
    message: { type: String, default: false }
  },
  methods: {
    show() {
      const self = this;
      this.$toast.show(this.message, {
        duration:       null,
        containerClass: 'confirmDialog',
        action: [
          { text: 'Confirmar',  onClick: (e, toastObject) => { self.$emit('confirmed'); toastObject.goAway(0); }},
          { text: 'Cancelar',   onClick: (e, toastObject) => { self.$emit('cancelled'); toastObject.goAway(0); }}
        ]
      });
    },
    hide() {
      this.$toast.clear();
    }
  }
}
</script>

<style lang="scss">
.confirmDialog {
  .toasted {
    background: $brandLayer !important;
    color:      $white !important;
  }

  a {
    transition: $transition !important;
    color:      $layer1 !important;
    &:hover {
      transition:       $transition !important;
      color:            $layer5 !important;
      text-decoration:  none !important;
    }
  }
}

</style>