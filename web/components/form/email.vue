<script>
import Input from '@/components/form/input'
export default {
  extends: Input,
  computed: {
    type() {
      return 'email'
    },
    iconHelper() {
      return 'envelope'
    }
  }
}
</script>

<style></style>
