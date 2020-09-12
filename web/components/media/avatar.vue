<template>
  <div>
    <overlay :rounded="true">
      <template v-slot:default>
        <avatar :size="50" :src="networkIcon"></avatar>
      </template>
      <template v-if="removable" v-slot:hover>
        <div class="vertical middle center pl-3" @click="$emit('remove')">
          <font-awesome icon="times"></font-awesome>
        </div>
      </template>
    </overlay>
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