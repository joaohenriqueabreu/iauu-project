<template>
  <div class="horizontal">
    <div v-if="active" class="eq-spinner mr-2">
      <i></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: { type: Boolean, default: false }
  }
}
</script>

<style lang="scss" scoped>
.eq-spinner {
  height: 20px;
  width: 21px;
  // margin: 100px auto;
  transform: rotate(180deg);
}
.eq-spinner:before,
.eq-spinner:after,
.eq-spinner > i {
  float: left;
  width: 5px;
  height: 20px;
  background: $brandLayer;
  margin-left: 3px;
  content: '';
}
.eq-spinner:before {
  margin-left: 0;
}

.eq-spinner:before {
  animation: bounce-3 1s infinite linear;
}
.eq-spinner > i {
  animation: bounce-2 1s infinite linear;
}
.eq-spinner:after {
  animation: bounce-1 1s infinite linear;
}

// @for $i from 1 to 5 {
//   .eq-spinner > i.bounce-#{$i} {
//     animation: bounce-#{$i} 1s infinite linear;
//   }
// }

// .eq-spinner > i.second {
//   animation: bounce-3 1s infinite linear;
// }
// .eq-spinner > i.thrid {
//   animation: bounce-2 1s infinite linear;
// }
// .eq-spinner:after {
//   animation: bounce-1 1s infinite linear;
// }
@keyframes bounce-1 {
  0% {
    height: 1px;
  }
  16.7% {
    height: 20px;
  }
  33.4% {
    height: 20px;
  }
  100% {
    height: 1px;
  }
}
@keyframes bounce-2 {
  0% {
    height: 1px;
  }
  16.7% {
    height: 1px;
  }
  33.4% {
    height: 20px;
  }
  50% {
    height: 20px;
  }
  100% {
    height: 1px;
  }
}
@keyframes bounce-3 {
  0% {
    height: 1px;
  }
  33.4% {
    height: 1px;
  }
  50% {
    height: 20px;
  }
  66.7% {
    height: 20px;
  }
  100% {
    height: 1px;
  }
}
// @keyframes bounce-4 {
//   0% {
//     height: 1px;
//   }
//   33.4% {
//     height: 1px;
//   }
//   50% {
//     height: 20px;
//   }
//   66.7% {
//     height: 20px;
//   }
//   100% {
//     height: 1px;
//   }
// }
// @keyframes bounce-5 {
//   0% {
//     height: 1px;
//   }
//   33.4% {
//     height: 1px;
//   }
//   50% {
//     height: 20px;
//   }
//   66.7% {
//     height: 20px;
//   }
//   100% {
//     height: 1px;
//   }
// }
</style>
