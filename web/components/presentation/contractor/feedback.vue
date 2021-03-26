<template>
  <div v-if="!$empty(presentation)">
    <div v-if="presentation.is_presentation_close && !presentation.is_presentation_today" class="today">
      Apresentação se aproximando. Revise todos os detalhes e divirta-se!
    </div>
    <div v-if="presentation.is_presentation_today" class="today">
      Hoje é o dia da apresentação! Revise todos os detalhes e divirta-se!
    </div>
    <div v-if="presentation.is_presentation_past || presentation.is_presentation_today" class="box mt-4">
      <presentation-feedback v-if="$empty(feedback)" :presentation="presentation"></presentation-feedback>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PresentationFeedback from '@/components/presentation/feedback';
export default {
  components: {
    PresentationFeedback
  },
  async asyncData({ store, route }) {
    // Base presentation data already loaded
    await store.dispatch('feedback/loadPresentationFeedback', route.params.id);
  },
  computed: {
    ...mapState({ presentation: (state) => state.presentation.presentation }),
    ...mapState({ feedback: (state) => state.feedback.feedback })
  }
}
</script>

<style lang="scss" scoped>
  .today {
    background: $brandLayer;
    color: $layer2;
    border-radius: $edges;
    padding: 2 * $space;
    width: 100%;
    font-weight: $bold;
    text-align: center;
  }

  .box {
    background: $layer5;
    padding: 2 * $space;
    border-radius: $edges;
  }
</style>