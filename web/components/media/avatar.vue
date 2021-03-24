<template>
  <div>
    <overlay :rounded="true" v-if="removable">
      <template v-slot:default>
        <avatar :size="50" :src="networkIcon"></avatar>
      </template>
      <template v-slot:hover>
        <div class="vertical middle center pl-3" @click="$emit('remove')">
          <icon icon="times"></icon>
        </div>
      </template>
    </overlay>
    <div v-else>
      <a :href="media" target="_blank">
        <avatar :size="50" :src="networkIcon"></avatar>
      </a>
    </div>
  </div>
</template>

<script>
import MediaViewer from '@/components/media/viewer'
export default {
  extends: MediaViewer
}
</script>

<style>

</style>