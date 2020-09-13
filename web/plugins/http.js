export default ({ $axios, redirect }, inject) => {
  // $axios.setBaseURL(process.env.NUXT_ENV_API_URL)
  $axios.setBaseURL('api/v1')

  inject('isClientSide', process.browser)
}
