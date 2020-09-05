const resolveImage = (relativePath) => {
  return `${process.env.cdnStaticAssetsDomain}/${relativePath}`
}

export default ({ app }, inject) => {
  inject('images', resolveImage)
}
