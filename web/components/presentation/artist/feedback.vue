<template>
  <div>
    <div v-if="presentation.is_presentation_past">
      <div v-if="!presentation.was_confirmed_by_artist" class="mb-5 vertical middle">
        <h3 class="mb-2">Apresentação realizada no dia {{ presentation.timeslot.end_dt | date }}</h3>
        <h6 class="mb-5">Favor confirmar a realização</h6>
        <div class="half-width">
          <form-button @action="confirm">Confirmar Realização</form-button>
        </div>
      </div>
      <div v-else class="message confirmed mb-5">
        <h6>Obrigado por confirmar a realização da apresentação no dia {{ presentation.timeslot.end_dt | date }}</h6>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  computed: {
    ...mapState({ presentation: (state) => state.presentation.presentation }),
  },
  methods: {
    ...mapActions('presentation', ['confirmPresentation']),
    async confirm() {
      try {
        await this.confirmPresentation(this.presentation.id);
        this.$toast.success(
          'Obrigado por confirmar a realização da apresentação. Iniciaremos agora o procedimento de pagamento.',
          { duration: 10000 }
        );
      } catch (error) {
        console.log(error);
        this.$toast.info('Você já confirmou a realização da apresentação, obrigado!');
      }
    },
  }
}
</script>

<style>

</style>