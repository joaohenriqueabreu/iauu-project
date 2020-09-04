const resolveImage = (relativePath) => {
  return `${process.env.CDN_STATIC_ASSETS_DOMAIN}/${relativePath}`
}

export default ({ app }, inject) => {
  inject('images', resolveImage)
}
