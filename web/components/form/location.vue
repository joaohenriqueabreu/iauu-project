<template>
  <div>
    <label :for="name">{{ label }}</label>
    <div class="form-input">
      <input
        ref="placesElement"
        :placeholder="placeholder"
        type="text"
        :value="selectedPlace.toString()"
        @input="locationInput"
      />
      <font-awesome icon="map-marker-alt"></font-awesome>
    </div>

    <input ref="formElement" name="location" type="hidden" />
  </div>
</template>

<script>
import FormInput from '@/components/form/input'
import Location from '@/models/location'

const MIN_PLACES_TRIGGER_LENGTH = 3

export default {
  extends: FormInput,
  props: {
    default: { type: Object, default: () => {} },
    street: { type: Boolean, default: false }
  },
  data() {
    return {
      autocomplete: {},
      autocompleteStatus: true,
      selectedPlace: new Location(),
      google: Object
    }
  },
  computed: {
    placesOptions() {
      const types = this.street ? ['address'] : ['(cities)']
      return {
        types,
        fields: ['address_component', 'geometry', 'formatted_address'],
        componentRestrictions: { country: 'br' }
      }
    }
  },
  watch: {
    selectedPlace(place) {
      this.$refs.formElement.value = place
    }
  },
  mounted() {
    this.autocomplete = new window.google.maps.places.Autocomplete(
      this.$refs.placesElement,
      this.placesOptions
    )

    if (!this.$utils.empty(this.default)) {
      this.selectedPlace = new Location(this.default)
    }
  },
  methods: {
    locationInput(event) {
      if (
        this.$refs.placesElement.value.length > MIN_PLACES_TRIGGER_LENGTH &&
        this.autocompleteStatus
      ) {
        this.disableAutocomplete()
        this.autocomplete.addListener('place_changed', this.placeChanged)
      }
    },
    placeChanged() {
      this.selectedPlace = new Location(this.autocomplete.getPlace())
      this.$emit('selected', this.selectedPlace)
    },
    resetPlace() {
      this.selectedPlace = null
    },
    disableAutocomplete() {
      this.autocompleteStatus = false
    }
  }
}
</script>

<style lang="scss">
// Overwrite places-autocomplete style
.pac-container {
  background: $layer1;
  color: $brand;
  border-top: none;
  padding: $space;
  font-family: Gotham;
  .pac-item {
    // background: $layer2;
    cursor: pointer;
    border-top: none;
  }
  .pac-item-query {
    color: $brandLayer;
  }
  .pac-logo {
    color: $layer2;
  }
}
</style>
