<script>
import Input from '@/components/form/input'
export default {
  extends: Input,
  computed: {
    type() {
      return 'time'
    },
    iconHelper() {
      return 'clock'
    }
  }
}
</script>

<style></style>
