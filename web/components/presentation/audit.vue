<template>
  <div>
    <p>
      <span class="audit-dt">{{ proposal.created_dt | date }}</span> Proposta de apresentação para {{ proposal.tentative_dt | date }} enviada por {{ contractor.name }}
    </p>
    <p>
      <span class="audit-dt">{{ presentation.created_dt | date }}</span> Apresentação contratadapara {{ proposal.tentative_dt | date }} enviada por {{ contractor.name }}
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({ proposal:     state => state.presentation.presentation.proposal }),
    ...mapState({ artist:       state => state.presentation.presentation.artist }),
    ...mapState({ contractor:   state => state.presentation.presentation.contractor }),
    ...mapState({ presentation: state => state.presentation.presentation })
  }
}
</script>

<style lang="scss" scoped>
.audit-dt {
  background:     $layer2;
  color:          $layer5;
  padding:        $space;
  border-radius:  $rounded;
  margin-right:   $space;
  margin-bottom:  2 * $space;
  font-weight:    $bold;
}

</style>