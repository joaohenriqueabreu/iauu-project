<template>
  <div>
    <modal ref="modal" height="small">
      <template v-slot:header>
        <div class="vertical middle">
          <h6>Deseja tornar adicionar um evento para esta data?</h6>
          <small>Ela ficará indisponível para receber propostas</small>
        </div>
      </template>
      <template v-slot:main>
        <div class="row my-4">
          <div class="col-sm-2"></div>
          <div class="col-sm-4 vertical center middle d-flex justify-content-end ml-5">
            <h3>{{ timeslot.start_dt | date }}</h3>
            <h6>{{ timeslot.start_dt | time }}</h6>
          </div>
          <div class="col-sm-4 vertical center middle d-flex justify-content-start mr-5">
            <h3>{{ timeslot.end_dt | date }}</h3>
            <h6>{{ timeslot.end_dt | time }}</h6>
          </div>
        </div>
        <form-toggle v-model="timeslot.full_day" class="d-flex justify-content-end"
          >Dia inteiro?</form-toggle
        >
        <div class="vertical mb-2">
          <form-input v-model="timeslot.title" placeholder="Título" icon="edit"></form-input>
          <form-textarea
            v-model="timeslot.description"
            placeholder="Descrição (opcional)"
            icon="edit"
          >
          </form-textarea>
        </div>
        <div class="d-flex justify-content-end">
          <!-- <div class="horizontal middle "> -->

          <!-- </div> -->
          <!-- <span class="space"></span> -->
          <!-- <form-select v-model="timeslot.frequency" :allow-input="false" :options="repeatOptions"></form-select> -->
        </div>
      </template>
      <template v-slot:footer>
        <form-button class="half-width mt-4" @action="save">Salvar</form-button>
      </template>
    </modal>
  </div>
</template>

<script>
import Timeslot from '@/models/timeslot'
export default {
  props: {
    default: { type: String, default: '' }
  },
  data() {
    return {
      defaultStartTime: 8,
      defaultEndTime: 18,
      timeslot: { type: Timeslot, default: new Timeslot() }
    }
  },
  computed: {
    repeatOptions() {
      return ['Não repete', 'Todo dia', 'Toda semana', 'Todo mês']
    },
    startTime() {
      return this.moment(this.timeslot.start_dt).format('HH:mm')
    },
    endTime() {
      return this.moment(this.timeslot.end_dt).format('HH:mm')
    },
    fullDay() {
      return this.timeslot.full_day
    }
  },
  watch: {
    fullDay(isFullday) {
      if (!isFullday) {
        return
      }
      this.timeslot.start_dt = this.moment(this.timeslot.start_dt)
        .startOf('day')
        .toString()
      this.timeslot.end_dt = this.moment(this.timeslot.start_dt)
        .add(1, 'days')
        .startOf('day')
        .toString()
    }
  },
  methods: {
    openModal(timeslot) {
      this.timeslot = new Timeslot(timeslot)
      this.$refs.modal.open()
    },
    closeModal() {
      this.$refs.modal.close()
    },
    save() {
      this.timeslot.type = 'busy'
      this.$emit('save', this.timeslot)
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  width: 100%;

  .date-range-area {
    @extend .horizontal, .middle;
    width: 50%;
    height: 100%;
  }

  .space {
    padding-right: 2 * $space;
  }
}

h4 {
  margin-right: 4 * $space;
  padding-right: 4 * $space;
  border-right: 5px solid $layer3;
}
</style>
