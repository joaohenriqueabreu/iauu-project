import HTML2Canvas from 'html2canvas'

export default ({ app }, inject) => {
  inject('html2canvas', HTML2Canvas)
}
