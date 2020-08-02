<template>
  <div class="boxed horizontal middle">
    <font-awesome icon="map-marker-alt"></font-awesome>
    <a :href="encodedMapsLocation" target="_blank">
      <h6>{{ presentation.address.display }}</h6>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    presentation: { type: Object, default: () => {}}
  },
  computed: {
    encodedMapsLocation() {
      return encodeURI(`http://maps.google.com/maps?q=${this.presentation.address.display}`)
    },
  }
}
</script>
