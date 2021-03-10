module.exports = {
  pagarme: {
    antifraud: {
      document: {
        verylow: '55555555555',
        low: '44444444444',
        moderate: '33333333333',
        high: '22222222222',
        veryhigh: '11111111111' // payments will fail due to anti fraud risk check
      }
    }
  }
}