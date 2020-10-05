<script>
import Input from '@/components/form/input';
export default {
  extends: Input,
  props: {
    secure: { type: Boolean, default: false } // whether to validate while typing
  },
  computed: {
    type() {
      return 'password'
    },
    iconHelper() {
      return 'lock'
    }
  },
  methods: {
  //   afterInput(event) {
  //     const value = event.target.value;

  //     // Validation rules
  //     // At least one digit
  //     // At least one lowercase character
  //     // At least one uppercase character
  //     // At least one special character ([*.!@#$%^&(){}[]:;<>,.?/~_+-=|\])
  //     // At least 8 characters in length
  //     if (this.secure && !value.test("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\]).{8,32}$")) {
  //       this.$emit('error');
  //     }

  //     this.$emit('input', value);
  //   }
  }
}
</script>

<style></style>
