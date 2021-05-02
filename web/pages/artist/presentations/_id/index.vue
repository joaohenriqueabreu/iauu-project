<script>
import PresentationPage       from '@/components/presentation/page';
import ProposalSummary        from '@/components/proposal/summary';
import PresentationFeedback   from '@/components/presentation/artist/feedback';
import BillingDetails         from '@/components/presentation/artist/billing';

export default {
  extends: PresentationPage,
  computed: {
    wasConfirmedBy() {
      return this.presentation.was_confirmed_by_artist;
    },
    presentationTabComponents() {
      return [
        { status: 'proposal',   icon: 'phone',          title: 'Proposta',      component: ProposalSummary },
        { status: 'accepted',   icon: 'file-contract',  title: 'Contrato',      component: ProposalSummary },
        { status: null,         icon: 'guitar',         title: 'Apresentação',  component: PresentationFeedback },
        { status: 'completed',  icon: 'dollar-sign',    title: 'Faturamento',   component: BillingDetails },
        { status: 'paid',       icon: 'search',         title: 'Resumo',        component: ProposalSummary },
      ]
    },
    customPresentationDayIndex()  { return 2; },
    customBillingIndex()          { return 3; },
  }
}
</script>
