<template>
  <div class="horizontal middle">
    <a :href="encodedMapsLocation" target="_blank">
      <h6><icon icon="map-marker-alt"></icon>{{ presentation.address.display }}</h6>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    presentation: { type: Object, default: () => {} }
  },
  computed: {
    encodedMapsLocation() {
      return encodeURI(`http://maps.google.com/maps?q=${this.presentation.address.display}`)
    }
  }
}
</script>
