const BaseFactory = require('../base');
const config      = require('iauu/env');

module.exports = class PagarmeTransactionFactory extends BaseFactory {
  make() {
    return {
      // Sample response from Pagar.me API
      object: 'recipient',
      id: 're_ckmev5b8f02630q9tzhxd9n67',
      transfer_enabled: false,
      last_transfer: null,
      transfer_interval: 'daily',
      transfer_day: 0,
      automatic_anticipation_enabled: false,
      automatic_anticipation_type: 'full',
      automatic_anticipation_days: '',
      automatic_anticipation_1025_delay: 365,
      anticipatable_volume_percentage: 0,
      date_created: '2021-03-18T12:42:15.718Z',
      date_updated: '2021-03-18T12:42:15.718Z',
      bank_account: {
        object: 'bank_account',
        id: 18661043,
        bank_code: '341',
        agencia: '0932',
        agencia_dv: null,
        conta: '58054',
        conta_dv: '1',
        type: 'conta_corrente',
        document_type: 'cpf',
        document_number: '26268738888',
        legal_name: 'API BANK ACCOUNT',
        charge_transfer_fees: true,
        date_created: '2021-03-18T12:42:15.247Z'
      },
      status: 'active',
      status_reason: null,
      postback_url: `${config.url.api}/artists/60534aa8a17e3a4a0c2bb144/recipient/status/update`,
      register_information: {
        type: 'individual',
        document_number: '26268738888',
        name: 'Constance Brakus',
        email: 'Aileen75@yahoo.com'
      },
      metadata: null,
      external_id: null,
      mdr_configuration_id: null,
      fee_preset_id: null,
      automatic_anticipation_fee_reimbursement: null,
      statement_descriptor: null
    };
  }
}