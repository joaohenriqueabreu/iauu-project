<template>
  <div>
    <div class="mb-5 horizontal middle">
      <form-date v-model="filters.from" class="mr-4">
        Apresentações a partir de:
      </form-date>
      <form-date v-model="filters.to" class="mr-2">
        Apresentações até:
      </form-date>
      <div class="p-4 filter badge circle clickable horizontal center middle" :class="{ active: filters.from != null || filters.to != null }" @click="loadFilteredPresentations">
        <icon icon="calendar-alt" class="mr-0"></icon>
      </div>      
      <div class="filter" :class="{ active: filters.status === 'accepted' }" @click="loadFilteredPresentations('accepted')">A realizar</div>
      <div class="filter" :class="{ active: filters.status === 'completed' }" @click="loadFilteredPresentations('completed')">Realizadas</div>
      <div class="filter" :class="{ active: filters.status === 'cancelled' }" @click="loadFilteredPresentations('cancelled')">Canceladas</div>
    </div>
    <div class="vertical">
      <h6 class="mb-4">Próximas apresentações</h6>
      <nuxt-link v-for="(presentation, index) in presentations" :key="index" :to="`/${redirectRoute}/${presentation.id}`" target="_blank">
        <presentation-info :presentation="presentation"></presentation-info>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PresentationInfo from '@/components/presentation/info';
export default {
  components: {
    PresentationInfo,
  },
  data() {
    return {
      filters: {
        status: 'accepted',
        from:   '',
        to:     '',
      }
    }
  },
  async mounted() {
    await this.loadFilteredPresentations();
  },
  computed: {
    ...mapState({ presentations: (state) => state.presentation.presentations }),
  },
  methods: {
    ...mapActions('presentation' , ['loadPresentations']),
    async loadFilteredPresentations(status) {
      this.filters.status = status == null || this.filters.status === status ? null : status;
      await this.loadPresentations(this.filters);
    }
  },  
}
</script>

<style lang="scss" scoped>
.filter {
  padding:        2 * $space;
  transition:     $transition;
  background:     $layer4;
  border-radius:  $rounded;
  color:          $brand;
  font-weight:    $bold;
  margin-right:   $space;
  cursor:         pointer;

  &:hover {
    transition: $transition;
    background: $brandLayer;
  }

  &.active {
    background: $brandLayer;
  }
}
</style>
