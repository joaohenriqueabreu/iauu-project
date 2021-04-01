const isCypress = process.client && typeof window.Cypress !== undefined

export default context => {
  if (isCypress) {
    // Provide nuxt interface for cypress
    window.nuxtApp = context
    window.appReady = true
  }
}