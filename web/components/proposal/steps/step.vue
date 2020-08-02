<script>
import { mapActions } from 'vuex'
export default {
  props: {
    value: { type: Object, default: () => {} },
    steps: { type: Array, default: () => {} },
    completedSteps: { type: Array, default: () => {} },
    proposal: { type: Object, default: () => {} }
  },
  computed: {
    // ...mapState({ proposal: (state) => state..proposal }),
    proposalDate() {
      if (!this.$utils.empty(this.proposal)) {
        return this.moment(this.proposal.timeslot.start_dt).format(this.$config.dateFormat)
      }

      return 'Data ainda não definida'
    }
  },
  methods: {
    ...mapActions('contractor', ['editProposal'])
  }
}
</script>

<style lang="scss" scoped></style>
