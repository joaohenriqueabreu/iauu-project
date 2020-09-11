const isValidURL = (value) => {
  try { const url = new URL(value) } 
  catch (err) { return false }

  return true
};

const resolveImage = (imagePath) => {
  // If it's an s3 image, parse and use app assets CDN
  if (imagePath.includes(process.env.s3AppAssetsBucketUrl)) { 
    return imagePath.replace(process.env.s3AppAssetsBucketUrl, process.env.cdnAppAssetsDomain)
  }

  // if already in valid url format
  if (isValidURL(imagePath)) { 
    return imagePath
  }

  // Otherwise serve from CDN
  return `${process.env.cdnStaticAssetsDomain}/${imagePath}`
}

export default ({ app }, inject) => {
  inject('images', resolveImage)
}
