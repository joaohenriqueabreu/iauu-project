<template>
  <div class="event position-relative" :class="simple ? '': 'interact'">
    <!-- Just testing different styles (this one is a circle with white text - whereas ) -->
    <!-- <div class="top-right horizontal middle p-2">
      <div class="status-badge mr-2" :class="presentation.status"></div>
      <h6 class="hide-mobile">
        {{ presentationStatusLabel }}
      </h6>
    </div>     -->
    <div class="top-right horizontal middle p-2">
      <div class="status-badge" :class="presentation.status">
        <h6>{{ presentationStatusLabel }}</h6>
      </div>
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
    showStatus:   { type: Boolean, default: true }
  },
  data() {
    return {
      PRESENTATION_STATUS_LABELS_MAP: {
        'proposal':   'Proposta',
        'accepted':   'Contratada',
        'completed':  'Realizada', 
        'paid':       'Fechada',
        'cancelled':  'Cancelada'
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
  margin-bottom:  3 * $space;
  padding:        2 * $space;
  transition:     $transition;
  border-radius:  $edges;

  &.interact {
    @extend .clickable;
    box-shadow:     $shadow;
    background:     $layer3;

    &:hover {
      transition:   $transition;
      background:   $layer4;
    }
  }

  h4 {
    margin-right:   4 * $space;
  }

  .info {
    border-left:    5px solid $layer2;
    padding-left:   4 * $space;
  }
}

.status-badge {
  padding:        $space;
  font-weight:    $bold;
  border-radius:  $smoothEdges;
  // position:       absolute;
  // top:            $space;
  // right:          $space;
  font-size:      $small;

  &.proposal {
    // background:   $warning;
    color:        $warning;
  }

  &.accepted {
    // background:   $brandLayer;
    color:        $brandLayer;
  }

  &.completed, &.paid {
    // background:   $success;
    color:        $green;
  }

  &.cancelled, &.rejected {
    // background:   $error;
    color:        $error;
  }
}
</style>
