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

const oneDecimal = (value) => { return (Math.round(value * 100) / 100).toFixed(1) }
const twoDecimals = (value) => { return (Math.round(value * 100) / 100).toFixed(2) }

// https://stackoverflow.com/questions/7034754/how-to-set-a-file-name-using-window-open
const download = (csv) => {
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
const convert = (data) => {
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

// Registering custom filters
Vue.filter('date', dateFilter)
Vue.filter('longDate', longDateFilter)
Vue.filter('datetime', datetimeFilter)
Vue.filter('time', timeFilter)
Vue.filter('oneDecimal', oneDecimal)
Vue.filter('twoDecimals', twoDecimals)
Vue.filter('timeAgo', timeAgoFilter)

export default ({ app }, inject) => {
  inject('array', array)
  inject('collection', collection)
  inject('math', math)
  inject('object', { clone })
  inject('moment', moment)
  inject('csv', { download, convert })
  inject('copyToClipboard', copyToClipboard)
}
