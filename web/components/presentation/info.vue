<template>
  <div class="event">
    <h4>{{ presentationDate | date }}</h4>
    <div class="info">
      <div class="mb-3">
        <h5 class="mb-0">{{ presentation.proposal.title }}</h5>
        <small>{{ getOtherParty }}</small>
      </div>
      <div class="horizontal">
        <h6 class="mr-5">
          <font-awesome icon="clock" class="mr-2"></font-awesome>
          {{ presentationDate | time }}
        </h6>
        <span class="">
          <font-awesome icon="map-marker-alt" class="mr-2"></font-awesome>
          {{ presentation.address.display }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    presentation: { type: Object, default: () => {} }
  },
  computed: {
    presentationDate() {
      if (!this.$empty(this.presentation.timeslot)) {
        return this.presentation.timeslot.start_dt
      }

      if (this.presentation.status === 'proposal') {
        return this.presentation.proposal.timeslots[0].start_dt
      }

      return ''
    },
    getOtherParty() {
      if (this.$auth.hasScope('artist')) {
        return this.presentation.contractor.user.name
      }

      return this.presentation.artist.user.name
    }
  },
}
</script>

<style lang="scss" scoped>
.event {
  @extend .full-width, .horizontal, .middle, .clickable;
  margin-bottom: 3 * $space;
  padding: 2 * $space;
  background: $layer3;
  box-shadow: $shadow;
  border-radius: $edges;
  transition: $transition;

  h4 {
    margin-right: 4 * $space;
  }

  .info {
    border-left: 5px solid $layer2;
    padding-left: 4 * $space;
  }

  &:hover {
    transition: $transition;
    background: $layer4;
  }
}
</style>
