const config = {
  companyName: process.env.companyName,
  dateFormat: 'DD/MM/YYYY',
  dateTimeFormat: 'DD/MM/YYYY HH:mm',
  timeFormat: 'HH:mm',
  alertTimer: 3000,
  closePresentationDeadline: 15,
  // defaultBGImgUrl: `${process.env.cdnStaticAssetsDomain}/concert.png`,
  defaultBGImgUrl: 'concert.png',
  defaultAvatarImgUrl: `${process.env.cdnStaticAssetsDomain}/music.png`,

  // Substrings to match url pattern and identify social media
  facebookSubstringMatch: ['facebook'],
  youtubeSubstringMatch: ['youtu.be', 'youtube'],
  vimeoSubstringMatch: ['vimeo'],
  instagramSubstringMatch: ['instagram'],
  tiktokSubstringMatch: ['vm.tiktok', 'tiktok'],
  spotifySubstringMatch: ['open.spotify'],
  pdfSubstringMatch: ['pdf'],

  sampleProductItems: [{ name: 'Apresentação' }, { name: 'Iluminação' }],

  maxProposedTimeslots: 3,
  // SCSS Colors to be used in js modules
  colors: {
    brandLayer: '#ff990a',
    layer1: '#141414',
    layer2: '#232323',
    layer3: '#373737',
    layer4: '#4b4b4b',
    layer5: '#5f5f5f',
    layer7: '#afafaf',
    layer10: '#efefef',
    white: '#fefefe'
  },

  priceRanges: {
    1: 'R$ 100 - R$ 500',
    2: 'R$ 500 - R$ 5.000',
    3: 'R$ 5.000 - R$ 20.000',
    4: 'R$ 20.000 - R$ 100.000',
    5: 'R$ 100.000+',
  },

  minDurationInMinutes: 60,
  maxNotificationsDisplayed: 5,
  maxAllowedSubcategories: 5,
  maxAllowedPresentationTypes: 10
}

export default ({ app }, inject) => {
  inject('config', config)
}
