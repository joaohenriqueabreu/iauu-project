<template>
  <div>
    <overlay class="full-height">
      <template v-slot:default class="full-height">
        <div class="simple-container">
          <a :href="media" target="_blank">
            <link-preview :url="url">
              <template slot-scope="props">
                <div class="preview-img">
                  <div class="network-icon">
                    <avatar :src="networkIcon" :size="30" class="social"> </avatar>
                  </div>
                  <div>
                    <img class="card-img-top" :src="$images(props.img)" :alt="props.title" />
                  </div>
                </div>
                <div class=" thumb-description">
                  {{ props.title }}
                </div>
              </template>
              <template slot="loading">
                <div class="loading"></div>
              </template>
            </link-preview>
          </a>
        </div>
      </template>
      <template v-if="removable" v-slot:hover>
        <div class="vertical middle center pl-3" @click="$emit('remove')">
          <h4>
            <font-awesome icon="times"></font-awesome>Remover
          </h4>
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
