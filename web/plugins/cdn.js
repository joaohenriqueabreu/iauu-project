import config from '../static/data/config';

const isValidURL = (value) => {
  try { const url = new URL(value); } 
  catch (err) { return false; }

  return true;
};

const resolveImage = (imagePath) => {
  // Old filestack formats used to be objects, grab the url then
  if (imagePath === undefined || imagePath === null || typeof imagePath === 'object') {
    return config.defaultAvatarImgUrl;
  }

  // If it's an s3 image, parse and use app assets CDN
  if (imagePath.includes(process.env.s3AppAssetsBucketUrl) || imagePath.includes(process.env.s3StaticAssetsBucketUrl)) { 
    return imagePath.replace(process.env.s3AppAssetsBucketUrl, process.env.cdnAppAssetsDomain);
  }

  // if already in valid url format
  // TODO should use from ./url 
  if (isValidURL(imagePath)) { 
    return imagePath;
  }

  // Otherwise serve from CDN
  return `${process.env.cdnStaticAssetsDomain}/${imagePath}`;
}

export default ({ app }, inject) => {
  inject('images', resolveImage)
}
