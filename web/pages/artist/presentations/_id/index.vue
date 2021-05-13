<script>
import PresentationPage       from '@/components/presentation/page';
import ProposalSummary        from '@/components/proposal/summary';
import PresentationContract   from '@/components/presentation/contract';
import PresentationDay        from '@/components/presentation/artist/day';
import BillingDetails         from '@/components/presentation/artist/billing';
import PresentationStats      from '@/components/presentation/stats';

export default {
  extends: PresentationPage,
  computed: {
    wasConfirmedBy() {
      return this.presentation.was_confirmed_by_artist;
    },
    presentationTabComponents() {
      return [
        { status: 'proposal',   icon: 'phone',          title: 'Proposta',      component: ProposalSummary },
        { status: 'accepted',   icon: 'file-contract',  title: 'Contrato',      component: PresentationContract },
        { status: null,         icon: 'guitar',         title: 'Apresentação',  component: PresentationDay },
        { status: 'completed',  icon: 'dollar-sign',    title: 'Faturamento',   component: BillingDetails },
        { status: 'paid',       icon: 'search',         title: 'Resumo',        component: PresentationStats },
      ]
    },
    customPresentationDayIndex()  { return 2; },
    customBillingIndex()          { return 3; },
  }
}
</script>
