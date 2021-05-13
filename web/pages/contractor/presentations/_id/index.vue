<script>
import PresentationPage       from '@/components/presentation/page';
import ProposalSummary        from '@/components/proposal/summary';
import PresentationContract   from '@/components/presentation/contract';
import PresentationProduction from '@/components/presentation/contractor/production';
import PresentationFeedback   from '@/components/presentation/contractor/feedback';
import BillingDetails         from '@/components/presentation/contractor/billing';
import PresentationStats      from '@/components/presentation/stats';

export default {
  extends: PresentationPage,
  computed: {
    wasConfirmedBy() {
      return this.presentation.was_confirmed_by_artist;
    },
    presentationTabComponents() {
      return [
        { status: 'proposal',   icon: 'search-dollar',  title: 'Proposta',      component: ProposalSummary },
        { status: 'accepted',   icon: 'signature',      title: 'Contrato',      component: PresentationContract },
        { status: null,         icon: 'tasks',          title: 'Produção',      component: PresentationProduction },
        { status: null,         icon: 'music',          title: 'Apresentação',  component: PresentationFeedback },
        { status: 'completed',  icon: 'credit-card',    title: 'Faturamento',   component: BillingDetails },
        { status: 'paid',       icon: 'check',          title: 'Resumo',        component: PresentationStats },
      ]
    },
    customPresentationDayIndex()  { return 3; },
    customBillingIndex()          { return 4; },
  }
}
</script>