<template>
  <div v-if="!$empty(presentation)">
    <div v-if="presentation.is_presentation_close && !presentation.is_presentation_today" class="message today mb-4">
      Apresentação se aproximando. Revise todos os detalhes e divirta-se!
    </div>
    <div v-if="presentation.is_presentation_today" class="message today mb-4">
      Hoje é o dia da apresentação! Revise todos os detalhes e divirta-se!
    </div>
    <div v-if="presentation.is_presentation_past">
      <div v-if="!presentation.was_confirmed_by_contractor" class="mb-5 vertical middle">
        <h3 class="mb-2">Apresentação realizada no dia {{ presentation.timeslot.end_dt | date }}</h3>
        <h6 class="mb-5">Favor confirmar a realização e se possível nos dar um feedback de como foi sua experiência!</h6>
        <div class="half-width">
          <form-button @action="confirm">Confirmar Realização</form-button>
        </div>
      </div>
      <div v-else class="message confirmed mb-5">
        <h6>Obrigado por confirmar a realização da apresentação no dia {{ presentation.timeslot.end_dt | date }}</h6>
      </div>
      <div class="box mb-4" v-if="!hasFeedback">
        <presentation-feedback :presentation="presentation"></presentation-feedback>
      </div>
      <div v-else class="mb-5 vertical center middle">
        <h6><b>Seu feedback foi registrado em {{ feedback.created_dt | date }}. Obrigado!</b></h6>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PresentationFeedback from '@/components/presentation/feedback';
export default {
  components: {
    PresentationFeedback
  },
  async created() {
    await this.loadPresentationFeedback(this.$route.params.id);
  },
  computed: {
    ...mapState({ presentation: (state) => state.presentation.presentation }),
    ...mapState({ feedback: (state) => state.feedback.feedback }),
    hasFeedback() {
      return !this.$empty(this.feedback);
    }
  },
  methods: {
    ...mapActions('presentation', ['confirmPresentation', 'cancelPresentation']),
    ...mapActions('feedback', ['loadPresentationFeedback']),
    async confirm() {
      try {
        await this.confirmPresentation(this.presentation.id);
        this.$toast.success(
          'Obrigado por confirmar a realização da apresentação. Iniciaremos agora o procedimento de pagamento. Por favor, reserve alguns minutos para avaliar o artista, seu feedback é muito importante.',
          { duration: 10000 }
        );
        this.openFeedbackModal();
      } catch (error) {
        console.log(error);
        this.$toast.info('Você já confirmou a realização da apresentação, obrigado!');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .message {
      border-radius: $edges;
      padding: 2 * $space;
      width: 100%;
      font-weight: $bold;
      text-align: center;
      &.today {
        background: $brandLayer;
        color: $layer2;
      }

      &.confirmed {
        background: $green;
        color: $white;
      }

      &.info {
        background: $white;
        color: $layer3;
      }
  }

  .box {
    background: $layer5;
    padding: 2 * $space;
    border-radius: $edges;
  }
</style>