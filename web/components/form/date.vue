<template>
  <div>
    <h6><slot></slot></h6>
    <datepicker v-model="dateValue" @selected="change" class="form-input mt-2"></datepicker>
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
  data() {
    return {
      dateValue: ''
    }
  },
  mounted() {
    if (this.value != null) {
      this.dateValue = this.moment(this.value).format('YYYY-MM-DD');
    } else {
      this.dateValue = this.moment().format('YYYY-MM-DD');
    }
  },
  computed: {
    type() {
      return 'date';
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

.vdp-datepicker__calendar {
  background:   $layer1 !important;
  color:        $brand;
  font-weight:  $bold !important;
  border:       none !important;
  .cell:not(.blank):not(.disabled).day:hover, .cell:not(.blank):not(.disabled).month:hover, .cell:not(.blank):not(.disabled).year:hover {
    border: 1px solid $brandLayer !important;
  }

  .selected  {
    background: $brandLayer !important;
  }
}

// Make calendar content outstand when inside modal
.modal-content {
  .vdp-datepicker__calendar {
    position: fixed;
    z-index:  $moveToTop + 1;
  }
}

</style>
