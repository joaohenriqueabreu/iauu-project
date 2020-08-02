<script>
import Input from '@/components/form/input'
export default {
  extends: Input,
  computed: {
    type() {
      return 'password'
    },
    iconHelper() {
      return 'lock'
    }
  }
}
</script>

<style></style>
