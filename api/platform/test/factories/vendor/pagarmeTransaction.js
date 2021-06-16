const faker = require('faker');
const moment = require('moment');

const BaseFactory = require('../base');

module.exports = class PagarmeTransactionFactory extends BaseFactory {
  make() {
    return {
      object: 'transaction',
      status: 'processing',
      payment_method: 'credit_card',
      date_created: moment(faker.date.recent()).toISOString(),
      date_updated: moment(faker.date.recent()).toISOString(),
      refuse_reason: null,
      status_reason: 'acquirer',
      acquirer_response_code: null,
      acquirer_name: null,
      acquirer_id: null,
      authorization_code: null,
      split_rules: null,
      antifraud_metadata: {},
      amount: 0,
      authorized_amount: 0,
      paid_amount: 0,
      refunded_amount: 0,
      installments: 1,
      cost: 0
    };
  }
}

/** Remaining information sent from API - no need to handle for now (copied from sample API call)      
      reference_key: null,
      device: null,
      local_transaction_id: null,
      local_time: null,
      fraud_covered: false,
      fraud_reimbursed: null,
      order_id: null,
      risk_level: 'unknown',
      receipt_url: null,
      payment: null,
      addition: null,
      discount: null,
      private_label: null,
      pix_qr_code: null,
      pix_expiration_date: null
      
      soft_descriptor: null,
      tid: null,
      nsu: null,
      authorized_amount: 0,
      paid_amount: 0,
      refunded_amount: 0,
      installments: 1,
      cost: 0,
      card_holder_name: 'Noel Bogan',
      card_last_digits: '1111',
      card_first_digits: '411111',
      card_brand: 'visa',
      card_pin_mode: null,
      card_magstripe_fallback: false,
      cvm_pin: false,
      postback_url: 'https://test.iauu.com.br/api/payments/ihypjjraaqoti6y1/status/update',
      
      capture_method: 'ecommerce',
      antifraud_score: null,
      boleto_url: null,
      boleto_barcode: null,
      boleto_expiration_date: null,
      referer: 'api_key',
      ip: '190.109.66.201',
      subscription_id: null,
      phone: null,
      address: null,
      */