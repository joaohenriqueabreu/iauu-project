export default ({ app }, inject) => {
  inject('isClientSide', process.browser)
}