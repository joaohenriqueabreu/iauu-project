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
        <h6><b>Seu feedback foi registrado em {{ feedback.create_dt | date }}. Obrigado!</b></h6>
      </div>
    </div>
    <div class="box mb-5">
      <h3 class="mb-4">Itens incluidos na apresentação</h3>
      <div v-for="(item, index) in presentation.proposal.product.items" :key="index" class="horizontal middle">
        <icon icon="check"></icon><h6>{{ item }}</h6>
        <hr>
      </div>
    </div>
    <div class="box mb-5" v-if="!presentation.is_presentation_past">
      <h3>Checklist</h3>
      <small>Clique para marcar a tarefa como completa</small>
      <div v-if="!presentation.is_presentation_today">
        <form-input 
          v-model="newChecklistItem" 
          transparent 
          placeholder="Adicionar item ao checklist" 
          icon="check"
          @enter="addChecklistItem">
        </form-input>
      </div>
      <div class="my-4">
        <div v-for="(item, index) in checkListItems" :key="index" class="mb-3">
          <hr class="light" v-if="index !== 0">
          <div class="horizontal middle justify-content-between">
            <div class="horizontal middle clickable brand-hover" @click="markItemCompleted(index, item)">
              <icon 
                :icon="isItemCompleted(item) ? 'check' : 'asterisk'"
                :class="itemClass(item)">
              </icon>
              <h6 :class="itemClass(item)" class="mr-5">{{ item.name }}</h6>
            </div>
            <icon 
              v-show="!isItemCompleted(item) && !presentation.is_presentation_today && !presentation.is_presentation_past" 
              class="text-right clickable brand-hover" icon="trash-alt" @click="removeChecklistItem(index)">
            </icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import PresentationFeedback from '@/components/presentation/feedback';
export default {
  components: {
    PresentationFeedback
  },
  async created() {
    await this.loadPresentationFeedback(this.$route.params.id);
  },
  data() {
    return {
      newChecklistItem: ''
    }
  },
  computed: {
    ...mapState({ presentation: (state) => state.presentation.presentation }),
    ...mapState({ feedback: (state) => state.feedback.feedback }),
    ...mapFields('presentation', { checkListItems: 'presentation.checklist' }),
    hasFeedback() {
      return !this.$empty(this.feedback);
    }
  },
  methods: {
    ...mapActions('presentation', ['confirmPresentation', 'cancelPresentation', 'editPresentation']),
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
    },
    isItemCompleted(item) {
      return item.completed !== 'false';
    },
    itemClass(item) {
      return this.isItemCompleted(item) ? 'completed' : '';
    },
    // TODO this vuex-map-fields here is not efficient, we should refactor this and drastically recudece code
    async addChecklistItem() {
      if (this.newChecklistItem.length === 0) {
        this.$toast.error('O item do checklist não pode estar vazio');
        return;
      }

      // Seems that vuex-map-fields does not support push operation, therefore we need to copy the array, transform and assign it as whole to the state
      let checkListItems = this.$object.clone(this.checkListItems);
      checkListItems.push({ name: this.newChecklistItem, completed: false });
      this.checkListItems = checkListItems;

      await this.editPresentation();
      this.$toast.success('Item adicionado com sucesso ao checklist');
      this.newChecklistItem = '';
    },
    async markItemCompleted(index, item) {
      if (this.isItemCompleted(item)) { return; }

      let checkListItems = this.$object.clone(this.checkListItems);
      checkListItems[index].completed = true;
      this.checkListItems = checkListItems;

      await this.editPresentation();
      this.$toast.success('Item marcado como completo');
      this.newChecklistItem = '';
    },
    async removeChecklistItem(index) {
      let checkListItems = this.$object.clone(this.checkListItems);
      this.$delete(checkListItems, index);
      this.checkListItems = checkListItems;

      await this.editPresentation();
      this.$toast.success('Item removido do checklist');
      this.newChecklistItem = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.completed {
  color: $brandLayer;
}

[data-icon="asterisk"] {
  font-size: $tiny;
}

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