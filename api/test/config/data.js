module.exports = {
  pagarme: {
    document: {
      valid: {
        formatted: '062.293.236-56',
        unformatted: '06229323656'
      }
    },
    antifraud: {
      risk: {
        verylow: '55555555555',
        low: '44444444444',
        moderate: '33333333333',
        high: '22222222222',
        veryhigh: '11111111111' // payments will fail due to anti fraud risk check
      }
    },
    boleto: {
      url: 'https://pagar.me',
      barcode: '1234 5678'
    }
  }
}