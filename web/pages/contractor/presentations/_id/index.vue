<template>
  <div v-if="!$empty(presentation)">
    <tabs :items="presentationTabs" :default-tab="presentationStatusIndex">
      <div class="mb-4 position-relative">
        <h1 class="mb-2">{{ presentation.proposal.title }} {{ presentationDt }} </h1>
        <h6 class="mb-2">{{ presentation.address.short_display }}</h6>
        <h4 class="mb-5">{{ presentationLabels[presentationStatusIndex] }}</h4>
        <timeline
          class="mb-4"
          :steps="PRESENTATION_STATUS_MAP.length" 
          :completed="presentationStatusIndexes" 
          :current="presentationStatusIndex" 
          :icons="presentationIcons"
          :labels="presentationLabels"
          >
        </timeline>
      </div>
    </tabs>
  </div>
</template>

<script>
import _ from 'lodash'; // TODO use from global
import { mapState } from 'vuex';
import ProposalDetails from '@/components/presentation/contractor/proposal';
import PresentationProduction from '@/components/presentation/contractor/production';
import PresentationFeedback from '@/components/presentation/contractor/feedback';
import InvoiceDetails from '@/components/presentation/contractor/invoice';
// Map presentation status to tab index
export default {
  async asyncData({ app, store, route }) {
    await store.dispatch('presentation/loadPresentation', route.params.id);
  },
  data() {
    return { 
      PRESENTATION_STATUS_MAP: [
        'proposal', // Proposta
        'accepted', // Contrato
        null, // Produção
        null, // Apresentação
        'completed', // Faturamento
        'paid' // Resumo
      ]
    }
  },
  computed: {
    ...mapState({presentation: (state) => state.presentation.presentation }),
    presentationTabs() {
      return [
        { title: 'Proposta', component: ProposalDetails },
        { title: 'Contrato', component: ProposalDetails },
        { title: 'Produção', component: PresentationProduction },
        { title: 'Apresentação', component: PresentationFeedback },
        { title: 'Faturamento', component: InvoiceDetails },
        { title: 'Resumo', component: ProposalDetails },
      ]
    },
    presentationIcons() {
      return [
        'search-dollar', 'signature', 'cogs', 'music', 'credit-card', 'check'
      ];
    },
    presentationLabels() {
      return this.$collection.map(this.presentationTabs, 'title');
    },
    presentationDt() {
      return this.moment(this.presentation.display_start_dt).format('DD/MM HH:mm') + ' - ' +
        this.moment(this.presentation.display_end_dt).format('HH:mm');
    },
    presentationStatusIndexes() {
      return _.range(this.presentationStatusIndex);
    },
    presentationStatusIndex() {
      if (this.presentation.is_contracted && (this.presentation.is_presentation_close || this.presentation.is_presentation_past)) {
        return 3; // Index of "Apresentação"
      }
      return this.$array.indexOf(this.PRESENTATION_STATUS_MAP, this.presentation.status);
    }
  }
}
</script>

<style>
</style>