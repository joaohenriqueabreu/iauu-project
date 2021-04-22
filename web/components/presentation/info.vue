<template>
  <div class="event position-relative" :class="simple ? '': 'interact'">
    <div v-if="showStatus" class="label">
      {{ presentationStatusLabel }}
    </div>
    <h4>{{ presentationDate | date }}</h4>
    <div class="info">
      <div class="mb-3">
        <h5 class="mb-0">{{ presentation.title }}</h5>
        <small>{{ getOtherParty }}</small>
      </div>
      <div class="horizontal">
        <h6 class="mr-5">
          <icon icon="clock" class="mr-2"></icon>
          {{ presentationDate | time }}
        </h6>
        <span class="" v-if="!$empty(presentation.address)">
          <icon icon="map-marker-alt" class="mr-2"></icon>
          {{ presentation.address.display }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    presentation: { type: Object, default: () => {} },
    simple:       { type: Boolean, default: false },
    showStatus:   { type: Boolean, default: false }
  },
  data() {
    return {
      PRESENTATION_STATUS_LABELS_MAP: {
        'proposal':   'Proposta',
        'accepted':   'Contratada',
        'completed':  'Realizada', 
        'paid':       'Fechada' 
      }
    }
  },
  computed: {
    presentationStatusLabel() {
      return this.PRESENTATION_STATUS_LABELS_MAP[this.presentation.status];
    },
    presentationDate() {
      return this.presentation.timeslot.start_dt;
    },
    getOtherParty() {
      if (this.$auth.hasScope('artist')) {
        return this.presentation.contractor.name;
      }

      return this.presentation.artist_name;
    }
  }
}
</script>

<style lang="scss" scoped>
.event {
  @extend .full-width, .horizontal, .middle;
  margin-bottom: 3 * $space;
  padding: 2 * $space;
  transition: $transition;
  border-radius: $edges;

  &.interact {
    @extend .clickable;
    box-shadow: $shadow;
    background: $layer3;

    &:hover {
      transition: $transition;
      background: $layer4;
    }
  }

  h4 {
    margin-right: 4 * $space;
  }

  .info {
    border-left: 5px solid $layer2;
    padding-left: 4 * $space;
  }
}

.label {
  padding: $space;
  font-weight: $bold;
  border-radius: $edges;
  position: absolute;
  top: $space;
  right: $space;
  font-size: $small;

  &.proposal {
    background: $layer5;
    color: $white;
  }

  &.accepted {
    background: $brandLayer;
    color: $white;
  }

  &.completed, &.paid {
    background: $success;
    color: $white;
  }
}
</style>
