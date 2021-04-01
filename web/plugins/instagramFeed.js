import InstagramFeed from '@/assets/js/instagramFeed.min.js'

export default ({ $axios, redirect }, inject) => {
  inject('instagram', InstagramFeed)
}