<template>
  <div class="boxed full-width">
    <!-- Can add any title or general purpose description here -->
    <slot></slot>
    <div>
      <ul class="horizontal horizontal-scroll mt-4 pl-0">
        <li v-for="(title, index) in tabHeaders" :key="index" 
          class="nav-link" 
          :class="{ active: isActiveTab(index) }" 
          @click="activeTab = index">
          <h6>{{ title }}</h6>
        </li>
      </ul>
    </div>
    <div class="mb-5 raised p-5" :class="{ first: isFirstTabActive }">
      <fade-transition mode="out-in" v-for="(component, index) in tabComponents" :key="index">
        <component :is="component" v-if="isActiveTab(index)" @navigate="navigateToTab"></component>
      </fade-transition>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items:      Array,
    defaultTab: Number
  },
  data() {
    return {
      activeTab: 0
    }
  },
  mounted() {
    if (this.defaultTab !== undefined) { this.activeTab = this.defaultTab; }
  },
  computed: {
    tabHeaders() {
      return this.$array.map(this.items, 'title');
    },
    tabComponents() {
      return this.$array.map(this.items, 'component');
    },
    isFirstTabActive() { 
      return this.isActiveTab(0);
    }
  },
  methods: {
    isActiveTab(index)    { return this.activeTab === index; },
    navigateToTab(index)  { this.activeTab = index; }
  }
}
</script>

<style lang="scss" scoped>
header {
  height:               30vh;
  background-size:      cover;
  position:             relative;
  top:                  0;
  left:                 0;
  width:                100%;
  background-position:  center;
  background-repeat:    no-repeat;
  background-size:      cover;
}

main {
  @extend .vertical, .center, .middle;
  position:       relative;
  margin-bottom:  5 * $space;
  .logo {
    position:     absolute;
    top:          -75px;
    z-index:      $above;
  }

  .boxed {
    @extend .vertical, .middle;
    background:     $layer3;
    box-shadow:     $shadow;
    border-radius:  $edges;
    padding:        5 * $space;
    position:       relative;
    z-index:        $base;

    ul {
      margin-bottom:            0;
      padding-left:             0;
      z-index:                  $above;
      border-top-left-radius:   $edges;
      border-top-right-radius:  $edges;

      li {
        padding-top:      2 * $space;
        padding-bottom:   2 * $space;
        z-index:          $above;
        width:            200px;
        text-align:       center;
        display:          flex;
        justify-content:  center;
        align-items:      center;
        cursor:           pointer;
        margin-right:     2 * $space;

        transition:       $transition;
        &:hover {
          transition:     $transition;
          color:          $brandLayer;
        }

        &.active {
          background:               $layer4;
          border-top-left-radius:   $edges;
          border-top-right-radius:  $edges;
          padding:                  $space !important;
        }
      }
      
    }

    .raised {
      transition:       $transition;
      background:       $layer4;
      padding:          4 * $space;
      box-shadow:       $shadow;
      border-radius:    $edges;
      min-height:       50vh;
      border-radius:    $edges;
      &.first {
        border-radius:  0 $edges $edges $edges; 
      }
    }
  }

  .vue-avatar--wrapper {
    box-shadow: $shadow;
  }
}

footer {
  height:         10vh;
  position:       relative;
}

// Overwrite bootstrap styling
.nav-tabs {
  border-bottom:  none;
  z-index:        $above;
  .nav-link {
    padding:                  0;
    border:                   none;
    border-top-left-radius:   $edges;
    border-top-right-radius:  $edges;
    cursor:                   pointer;
    transition:               $transition;

    &.first {
      padding-left:   0;
      padding-right:  0;
    }

    &.active {
      padding:        $space;
      background:     $layer4;
      border:         none;
      color:          $brand;
      box-shadow:     0 -19px 19px 2px rgba(0, 0, 0, 0.1);
    }

    &:hover {
      transition:     $transition;
      color:          $layer5;
    }
    a {
      padding-bottom: 2 * $space;
    }
  }
}
</style>