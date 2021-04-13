<template>
  <div>
    <datepicker v-model="value" @selected="change" class="form-input mt-2"></datepicker>
  </div>
</template>
<script>
import Datepicker from 'vuejs-datepicker';
import Input from '@/components/form/input';

export default {
  extends: Input,
  components: {
    Datepicker,
  },
  mounted() {
    if (this.value != null) {
      this.value = this.moment(this.value).format('YYYY-MM-DD');
    }
  },
  computed: {
    type() {
      return 'date'
    },
    iconHelper() {
      return 'calendar-alt';
    },
  },
  methods: {
    change(value) {
      this.$emit('input', value);
    }
  }
}
</script>

<style lang="scss">
// Overwrite HTML date picker icon style
input::-webkit-calendar-picker-indicator {
  visibility: hidden;
}

</style>
