<script>
import PresentationItem from '@/components/presentation/item';
export default {
  extends: PresentationItem,
  data() {
    return {      
      PRESENTATION_STATUS_LABELS_MAP: {
        'proposal':   'Aguardando Resposta',
        'accepted':   'Contratada',
        'completed':  'Realizada', 
        'paid':       'Fechada',
        'rejected':   'Rejeitada',
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