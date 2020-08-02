<template>
  <div>
    <div class="horizontal center middle">
      <h1 class="cap">{{ presentation.proposal.title }}</h1>
    </div>
    <div class="boxed">
      <div v-if="presentation.status === 'proposal'" class="vertical center middle mb-4">
        
        
      </div>
      <div v-else>
        
      </div>
      
    </div>
    
    
  </div>
</template>

<script>
import PickTimeslot from '@/components/presentation/timeslot'
import Attachment from '@/components/form/attachment'
export default {
  components: {
    attachment: Attachment,
    PickTimeslot
  },
  props: {
    presentation: { type: Object, default: () => {} }
  },
  computed: {
    
    
  },
  methods: {
    selectedTimeslot(timeslot) {
      this.$emit('selected-timeslot', timeslot)
    }
  }
}
</script>

<style lang="scss" scoped>
[data-icon] {
  font-size: $large;
  font-weight: $bold;
  color: $brand;
}

div {
  margin-bottom: 3 * $space;
}

.v-bar {
  border-right: 5px solid $layer2;
}


</style>
