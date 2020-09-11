import Vue from 'vue'
import array from 'lodash/array'
import collection from 'lodash/collection'
import math from 'lodash/math'
import clone from 'lodash/cloneDeep'
import moment from 'moment'
import VueFilters from 'vue2-filters'

Vue.use(VueFilters, {
  number: { thousandsSeparator: '.', decimalSeparator: ',' },
  currency: { symbol: 'R$ ', thousandsSeparator: '.', decimalSeparator: ',' }
})

// Custom filters
const dateFilter = (value) => { return moment(value).format('DD/MM/YYYY') }
const longDateFilter = (value) => { return moment(value).format('LL') }
const datetimeFilter = (value) => { return moment(value).format('DD/MM/YYYY HH:mm') }
const timeFilter = (value) => { return moment(value).format('HH:mm') }
const timeAgoFilter = (value) => { return moment(value).fromNow() }
const longTimeFilter = (time) => {
  if (time === undefined || time === null) { return '-' }
  if (typeof time === 'number') { return `${time} horas${time > 1 ? 's' : ''}` } // raw value
  const parts = time.split(':')
  return `${parts[0]} hora${parts[0] > 1 ? 's' : ''} ${parts[1] > 0 ? parts[1] + ' mins' : ''}`
}

const oneDecimal = (value) => { return (Math.round(value * 100) / 100).toFixed(1) }
const twoDecimals = (value) => { return (Math.round(value * 100) / 100).toFixed(2) }

// https://stackoverflow.com/questions/7034754/how-to-set-a-file-name-using-window-open
const downloadCsv = (csv) => {
  var downloadLink = document.createElement("a");
  var blob = new Blob(["\ufeff", csv]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = `${moment().format('YYYYMMDDHHmmss')}users.csv`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// https://stackoverflow.com/questions/11257062/converting-json-object-to-csv-format-in-javascript
const convertToCsv = (data) => {
  var array = typeof data != 'object' ? JSON.parse(data) : data;
  var str = '';
  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
        if (line != '') line += ','
        line += array[i][index];
    }

    str += line + '\r\n';
  }

  return str;
}

const copyToClipboard = (value) => {
  const el = document.createElement('textarea')
  el.value = value
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
}

const convertTimeToNumber = (time) => {
  if (time === undefined || time === null) { return 0 }
  if (typeof time === 'number') { return time } // raw value
  if (typeof time !== 'string') { return 0 } // non strng representation
  if (time.indexOf(':') === -1) { return 0 } // not well formatted

  console.log(time)
  const parts = time.split(':')
  return parts[0] * 60 + parts[1]
}

const linkPreview = {
  youtubeData: async (url) => {
    // url expected format
    // https://www.youtube.com/watch?v=yHafN0M2kl0&t=45s
    let videoId = url.split('v=')[1]
    const ampersandPosition = videoId.indexOf('&')
    if(ampersandPosition != -1) { videoId = videoId.substring(0, ampersandPosition) }

    const data = await this.$axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}`)
    console.log(data)
  }
}

const nl2br = (str, is_xhtml) => {
  if (typeof str === 'undefined' || str === null) {
      return '';
  }
  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}


// Registering custom filters
Vue.filter('date', dateFilter)
Vue.filter('longDate', longDateFilter)
Vue.filter('datetime', datetimeFilter)
Vue.filter('time', timeFilter)
Vue.filter('oneDecimal', oneDecimal)
Vue.filter('twoDecimals', twoDecimals)
Vue.filter('timeAgo', timeAgoFilter)
Vue.filter('longTime', longTimeFilter)
Vue.filter('nl2br', nl2br)

export default ({ app }, inject) => {
  inject('array', array)
  inject('collection', collection)
  inject('math', math)
  inject('object', { clone })
  inject('moment', moment)
  inject('csv', { download: downloadCsv, convert: convertToCsv })
  inject('copyToClipboard', copyToClipboard)
  inject('date', { convertTimeToNumber })
  inject('linkPreview', { linkPreview })
  inject('string', { nl2br })
}
