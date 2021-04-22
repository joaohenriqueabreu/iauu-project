<script>
import PresentationInfo from '@/components/presentation/info';
export default {
  extends: PresentationInfo,
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
    proposal() {
      return this.presentation;
    },
    presentationDate() {
      if (!this.$empty(this.proposal.selected_timeslot)) { 
        return this.proposal.selected_timeslot.start_dt ;
      }

      return this.proposal.timeslots[0].start_dt;
    }
  }
}
</script>