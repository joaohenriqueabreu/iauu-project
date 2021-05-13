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
    <div v-if="presentation.is_presentation_today" class="vertical center">
      <div v-if="presentation.is_presentation_today" class="today mb-4">
        Hoje é o dia da apresentação! Revise todos os detalhes e divirta-se!
      </div>
      <div v-if="!$empty(presentation.contractor.phone)" class="vertical center">
        <a :href="`https://wa.me/55${this.whatsappFormattedPhone}?text=${this.shareLocationMessage}`" class="whatsapp-link horizontal middle mb-4" target="_blank">
          <icon :icon="['fab', 'whatsapp']"></icon>
          Compartilhar sua localização
        </a>
        <small class="text-center half-width">
          Não deixe seu contrante esperando e compartilhe sua localização ao se direcionar para o local do evento.
          Clicando no botão acima, ira abrir o app do Whatsapp em seu telefone (ja com o contato do contratante selecionado).<br>
          <a href="https://faq.whatsapp.com/android/chats/how-to-use-live-location/?lang=pt_br" target="_blank">
            <u><small>Habilite a opcão de compartilhar localizar em tempo real.</small></u>
          </a> 
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  computed: {
    ...mapState({ presentation: (state) => state.presentation.presentation }),
    whatsappFormattedPhone() {
      return `55${this.$utils.clearFormat(this.presentation.contractor.phone)}`;
    },
    shareLocationMessage() {
      return encodeURI(`Olá, ${this.presentation.contractor.name} aqui é ${this.presentation.artist.name}. Já estamos a caminho da ${this.presentation.address.display} para nossa apresentação. Vai ser um sucesso!`);
    },
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

<style lang="scss" scoped>
  $zapGreen: #128C7E;

  .whatsapp-link {
    transition:     $transition;
    background:     $zapGreen;
    padding:        2 * $space;
    border:         4px solid $white;
    border-radius:  $rounded;
    color:          $white;
    text-align:     center;
    &:hover {
      transition: $transition;
      background: $white;
      color:      $zapGreen;
    }
  }

  .today {
      border-radius:  $edges;
      padding:        2 * $space;
      width:          100%;
      font-weight:    $bold;
      text-align:     center;
      background:     $brandLayer;
      color:          $layer2;
    }
</style>