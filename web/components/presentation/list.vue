<template>
  <div>
    <div class="mb-3 horizontal middle">
      <form-input v-model="filters.text" class="mr-4">Contem:</form-input>
      <form-date v-model="filters.from" class="mr-4">Iniciando em:</form-date>
      <form-date v-model="filters.to" class="mr-2">Até:</form-date>
    </div>
    <div class="horizontal middle mb-5">
      <div v-if="filters.text" class="filter" :class="{ active: filters.text != null }" @click="$set(filters, 'text', null)"><icon icon="times"></icon> Contem: "{{ filters.text }}"</div>
      <div v-if="filters.from" class="filter" :class="{ active: filters.from != null }" @click="$set(filters, 'from', null)"><icon icon="times"></icon> De: {{ filters.from | date }}</div>
      <div v-if="filters.to" class="filter" :class="{ active: filters.to != null }" @click="$set(filters, 'to', null)"><icon icon="times"></icon> Até: {{ filters.to | date }}</div>
      <div class="filter" :class="{ active: filters.status === 'accepted' }" @click="$set(filters, 'status', filters.status === 'accepted' ? null : 'accepted')">Proximas</div>
      <div class="filter" :class="{ active: filters.status === 'completed' }" @click="$set(filters, 'status', filters.status === 'completed' ? null : 'completed')">Realizadas</div>
      <div class="filter" :class="{ active: filters.status === 'cancelled' }" @click="$set(filters, 'status',filters.status === 'cancelled' ? null : 'cancelled')">Canceladas</div>
    </div>
    <div class="vertical">
      <h6 class="mb-4">Próximas apresentações</h6>
      <nuxt-link v-for="(presentation, index) in presentations" :key="index" :to="`/${redirectRoute}/${presentation.id}`" class="no-hover-effect">
        <presentation-item :presentation="presentation"></presentation-item>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import PresentationItem from '@/components/presentation/item';
export default {
  components: {
    PresentationItem,
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
    this.filters = { 
      status: 'accepted',
      from:   this.$route.query.from,
      to:     this.$route.query.to
    }
  },
  computed: {
    ...mapState({ presentations: (state) => state.presentation.presentations }),
  },
  watch: {
    filters: {
      async handler(value) {
        // Don't allow searching with few chars text
        // if (value.text != null && value.text.length < 3) { return; }

        await this.loadPresentations({
          text:     value.text == null || value.text == '' ? null : value.text,
          status:   value.status,
          from:     value.from != null ? this.moment(value.from).format('YYYY-MM-DD') : null,
          to:       value.to != null ? this.moment(value.to).format('YYYY-MM-DD') : null,
        }); 
      },
      deep: true,
    }
  },
  methods: {
    ...mapActions('presentation' , ['loadPresentations']),
  },  
}
</script>