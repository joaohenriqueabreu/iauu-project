<template>
  <div v-if="!$empty(presentation)">
    <tabs ref="tabs" :items="presentationTabComponents" :default-tab="presentationStatusIndex">
      <div class="mb-4 position-relative">
        <presentation-item simple show-status :presentation="presentation" class="mb-5"></presentation-item>
        <timeline
          class="mb-4"
          :steps="presentationTabComponents.length" 
          :completed="presentationStatusIndexes" 
          :current="presentationStatusIndex" 
          :icons="presentationIcons"
          :labels="presentationLabels"
          @clicked="navigateToTab">
        </timeline>        
      </div>
    </tabs>    
    <chat :presentation="presentation"></chat>    
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Chat             from '@/components/layout/chat';
import PresentationItem from '@/components/presentation/item';

export default {
  async created() {
    await this.loadPresentation(this.$route.params.id);
  },
  components: {
    Chat,
    PresentationItem,
  },
  data() {
    return { 
      PRESENTATION_STATUS_TABS_MAP: [
        'proposal',   // Proposta
        'accepted',   // Contrato
        null,         // Produção
        null,         // Apresentação
        'completed',  // Faturamento
        'paid'        // Resumo
      ],
    }
  },
  computed: {
    /******* Interfaces ********/
    presentationTabComponents()   { throw new Error('Must implement presentationTabComponents interface'); },
    wasConfirmedBy()              { throw new Error('Must implement wasConfirmedBy interface'); },
    customBillingIndex()          { throw new Error('Must implement customBillingIndex interface'); },
    customPresentationDayIndex()  { throw new Error('Must implement customPresentationDayIndex interface'); },
    /* *********************** */

    ...mapState({presentation: (state) => state.presentation.presentation }),
    presentationIcons() {
      return this.$array.map(this.presentationTabComponents, 'icon');
    },
    presentationLabels() {
      return this.$array.map(this.presentationTabComponents, 'title');
    },
    presentationDt() {
      return this.moment(this.presentation.display_start_dt).format('DD/MM HH:mm') + ' - ' +
        this.moment(this.presentation.display_end_dt).format('HH:mm');
    },
    presentationStatusIndexes() {
      return this.$array.range(this.presentationStatusIndex);
    },
    presentationStatusIndex() {      
      return this.customIndex || this.$array.findIndex(this.presentationTabComponents, (component) => component.status === this.presentation.status);
    },
    customIndex() {
      if (this.presentation.is_completed || 
        (this.presentation.is_contracted && this.presentation.is_presentation_past && this.presentation.was_confirmed_by_contractor)) {
        return this.customBillingIndex; // Index of "Faturamento"
      }
      if (this.presentation.is_contracted && 
        (this.presentation.is_presentation_close || this.presentation.is_presentation_today || this.presentation.is_presentation_past)) {
        return this.customPresentationDayIndex; // Index of "Apresentação"
      }

      return null;
    },
    numOfSteps() {
      return this.presentationTabComponents.length;
    }
  },
  methods: {
    ...mapActions('presentation', ['loadPresentation']),
    navigateToTab(index) {
      this.$refs.tabs.navigateToTab(index);
    }
  }
}
</script>