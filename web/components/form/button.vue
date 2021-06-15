<template>
  <div>
    <fade-transition :duration="300" mode="out-in">
      <!-- <div v-if="!submitted && !disabled && !processing" key="submitting" class="button" :class="btnClass" -->
      <div v-if="!submitted && !disabled && !processing" key="submitting" class="button" :class="[{ noShadow, small, disabled }, color]"
        @click="submit">
        <input ref="submit" type="submit" :disabled="disabled" @click.prevent="submit" />
        <slot></slot>
      </div>
      <div v-if="(submitted && !disabled) || processing" key="submitted" class="button loading">
        <loading :active="true"></loading>
      </div>
      <div v-if="disabled" key="submitted" class="text-center">
        <h6><u>Complete o formulário</u></h6>
      </div>
    </fade-transition>
  </div>
</template>

<script>
export default {
  props: {
    disabled:   { type: Boolean, default: false },
    small:      { type: Boolean, default: false },
    noShadow:   { type: Boolean, default: false },
    color:      { type: String, default: 'white' },
    processing: { type: Boolean, default: false },
  },
  data() {
    return {
      submitted:  false,
      submitting: false
    }
  },
  computed: {
    btnClass() {
      return `${this.disabled ? 'disabled' : ''} ${this.small ? 'small' : ''} ${this.noShadow ? 'no-shadow' : ''} ${this.color}`;
    }
  },
  methods: {
    submit() {
      // Prevent submit when disable or while submitting
      if (this.disabled || this.submitting) { return; }

      this.submitting = true;
      this.$emit('action');
      this.submitted = true;

      if (! this.processing) {
        setTimeout(this.reset, 3000);
      }
    },
    reset() {
      this.submitted = false;
      this.submitting = false;
    },
    delay() {
      return setTimeout(() => {}, 1000);
    }
  },
  watch: {
    hold: function(value) {
      if (value) { 
        this.reset(); 
      }
    }
  }
}
</script>

<style lang="scss" scoped>
input {
  display: none;
}

.button {
  @extend .horizontal, .middle, .center;
  transition:       $transition;
  cursor:           pointer;
  border-radius:    $rounded;
  padding:          10px;
  width:            100%;
  height:           100%;
  box-shadow:       $shadow;
  font-weight:      $bold;
  border:           none;
  outline:          none;
  color:            $white;

  &.white {
    background-color: $white;
    color:            $layer1;
  }

  &.brand {
    background-color: $brandLayer;
    color:            $layer1;
  }

  &.green {
    background-color: $green;
    color:            $layer1;
  }

  &.noShadow {
    box-shadow: none;
  }

  @include desktop {
    &:not(.small) {
      min-width: 150px;
    }
  }

  &.disabled {
    background: $layer3;
    cursor: default;
    box-shadow: none;
  }

  &:focus,
  &:active {
    outline: none;
  }
  
  &:hover {
    transition: $transition;
    background: $brandLayer;
    color:      $layer1 !important;
  }

  &:hover:not(.disabled) {
    transition: $transition;
    background: transparentize($brandLayer, 0.1);
    box-shadow: $higherShadow;
  }

  [data-icon] {
    color: black;
  }

  &.loading {
    cursor: default;
    &:hover {
      background: $white;
    }
  }
}
</style>
