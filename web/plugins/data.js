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
const dateFilter = (value) => {
  return moment(value).format('DD/MM/YYYY')
}

const longDateFilter = (value) => {
  return moment(value).format('LL')
}

const datetimeFilter = (value) => {
  return moment(value).format('DD/MM/YYYY HH:mm')
}

const timeFilter = (value) => {
  return moment(value).format('HH:mm')
}

const oneDecimal = (value) => {
  return (Math.round(value * 100) / 100).toFixed(1);
}

const twoDecimals = (value) => {
  return (Math.round(value * 100) / 100).toFixed(2);
}

// Registering custom filters
Vue.filter('date', dateFilter)
Vue.filter('longDate', longDateFilter)
Vue.filter('datetime', datetimeFilter)
Vue.filter('time', timeFilter)
Vue.filter('oneDecimal', oneDecimal)
Vue.filter('twoDecimals', twoDecimals)

export default ({ app }, inject) => {
  inject('array', array)
  inject('collection', collection)
  inject('math', math)
  inject('object', { clone })
  inject('moment', moment)
}
