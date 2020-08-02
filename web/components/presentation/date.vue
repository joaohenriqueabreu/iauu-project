<template>
  <div>
    <div class="my-4 countdown horizontal middle center">
      <countdown v-if="!isPresentationPast" :time="timeUntilPresentation">
        <template slot-scope="props">
          <h5 v-if="props.days > 1">Faltam {{ props.days }} dias</h5>
          <h5 v-else>Faltam {{ props.days }} dias : {{ props.hours }} horas : {{ props.minutes }} minutos</h5>
        </template>
      </countdown>
      <div v-else>
        <p>
          Conta pra gente como foi a apresentação! Confirme a Realização para podermos finalizar o processo de pagamento.
        </p>
        <p>
          Caso a apresentação não seja confirmada por ambas as partes em até
          <b>{{ $config.closePresentationDeadline }} dias</b> ela será automaticamente
          encerrada.
        </p>
      </div>
    </div>
    <div class="boxed horizontal middle">
      <h3 class="mr-4">
        <font-awesome icon="calendar-alt"></font-awesome>
        {{ eventDate }}
      </h3>
      <h5>{{ eventTime }}</h5>
    </div>    
  </div>
</template>

<script>
import VueCountdown from '@chenfengyuan/vue-countdown'

export default {
  components: {
    countdown: VueCountdown
  },
  props: {
    presentation: { type: Object, default: () => {}}
  },
  computed: {
    timeUntilPresentation() {
      return this.moment
        .duration(this.moment(this.presentation.timeslot.start_dt).diff(this.moment()))
        .as('milliseconds')
    },
    eventTime() {
      return (
        this.moment(this.presentation.timeslot.start_dt).format(this.$config.timeFormat) +
        ' - ' +
        this.moment(this.presentation.timeslot.end_dt).format(this.$config.timeFormat)
      )
    },
    eventDate() {
      return this.moment(this.presentation.timeslot.start_dt).format(this.$config.dateFormat)
    },
    isPresentationPast() {
      return this.moment(this.presentation.timeslot.start_dt).isBefore(this.moment())
    }
  },
  methods: {
    hasPresentationStarted() {
      return this.isPresentationPast
    }
  }
}
</script>

<style>

</style>