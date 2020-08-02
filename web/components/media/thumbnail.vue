<template>
  <div>
    <div v-if="avatar">
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
    <div v-if="!avatar && loaded" class="simple-container d-flex justify-content-between">
      <div class="horizontal middle">
        <avatar :size="50" :src="networkIcon" class="mr-4"></avatar>
        <a :href="link" target="_blank">
          <h6>{{ media.url }}</h6>
          <!-- <link-preview :url="media.url">
            <template slot-scope="props">{{ props.title }} </template>
            <template slot="loading">
              <div class="loading"></div>
            </template>
          </link-preview> -->
        </a>
      </div>
      <font-awesome v-if="removable" icon="times" class="clickable ml-5" @click="$emit('remove')">
      </font-awesome>
    </div>
  </div>
</template>

<script>
import MediaViewer from '@/components/media/viewer'
export default {
  extends: MediaViewer
}
</script>
