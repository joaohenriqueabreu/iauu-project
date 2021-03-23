<script>
// Override of VueAvatar component
import VueAvatar from 'vue-avatar';
export default {
  // components: { VueAvatar },
  extends: VueAvatar,
  // TODO NOTHING WORKS HERE!!!!!
  // props: {
  //   src: [String, Object],
  //   username: String,
  //   size: Number
  // },
  // methods: {
  //   isValidURL(value) {
  //     try { const url = new URL(value); } 
  //     catch (err) { return false; }

  //     return true;
  //   },
  // },
  // computed: {
  //   validSrc() {
  //     if (!this) { return; }
  //     if (this.$empty(this.src)) { return this.$config.defaultAvatarImgUrl; }
  //     if (this.isValidUrl(this.src)) { return this.src; }
  //     if (typeof this.src === 'string') { return this.$image(this.src); }
  //     if (typeof this.src === 'object' && this.src.hasOwnProperty('url') && !this.$empty(this.src.url)) { return this.src.url; }

  //     return this.$config.defaultAvatarImgUrl;
  //   }
  // },
}
</script>

<style>

</style>