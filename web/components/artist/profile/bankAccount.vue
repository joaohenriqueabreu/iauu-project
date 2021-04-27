<template>
  <div>
    <h6 class="mb-2" v-if="!hasConnectedBankAccount">Informe seus dados bancários para receber transferências pela nossa plataforma</h6>
    <small>
      Utilizamos a plataforma <a href="https://www.pagar.me" target="_blank"><small><u>pagar.me</u></small></a> 
      como nosso intermediador de pagamentos. 
      Por favor revise nossas <nuxt-link to="/terms" target="_blank"><small><u>políticas de privacidade e termos de serviço.</u></small></nuxt-link> seus dados estarão protegidos. 
      Ao registrar sua conta, você concorda com os nossos termos, prazos e processos de pagamento.
    </small>
    <div class="mb-5"></div>
    
    <div v-if="!hasConnectedBankAccount || hasFailedConnectingToGateway" class="container">
      <form-select v-model="$v.newBankAccount.institution.$model" :options="banksOptions" placeholder="Selecione a instituição financeira (número do banco)" auto-open :allow-input="false" class="mb-4"></form-select>
      <form-validation :error="$v.newBankAccount.institution.$error">Por favor escolha uma instituição financeira</form-validation>
      <div class="mb-2"></div>
      <form-input v-model="$v.newBankAccount.agency.$model" placeholder="Agência" icon="university"></form-input>
      <form-validation :error="$v.newBankAccount.agency.$error">Número da agência inválido (somente letras ou números - máximo 5 caractéres)</form-validation>
      <form-input v-model="$v.newBankAccount.number.$model" placeholder="Número da conta (com dígito)" icon="user-circle"></form-input>
      <form-validation :error="$v.newBankAccount.number.$error">Número da conta inválida (formato deve ser "número" - "digito")</form-validation>
      <form-masked v-model="$v.newBankAccount.document.$model" icon="id-card" placeholder="CPF/CNPJ" mask="document"></form-masked>
      <form-validation :error="$v.newBankAccount.document.$error">Número de documento inválido (formato deve ser CPF ou CNPJ) de acordo com o titular da conta</form-validation>
      <form-input v-model="$v.newBankAccount.legal_name.$model" placeholder="Nome do titular da conta" icon="signature"></form-input>
      <form-validation :error="$v.newBankAccount.legal_name.$error" class="mb-4">O nome do titular não pode estar vazio (máximo 30 caractéres)</form-validation>
      <form-button :disabled="$v.newBankAccount.$invalid" @action="saveArtistBankAccount">Salvar dados bancários</form-button>
    </div>
    <div v-else class="api">
      <div class="mb-4">
        <div v-if="hasConnectedBankAccount" class="horizontal middle">
          <h4><icon icon="check"></icon></h4>
          <h6>Contactado com sistema de pagamentos!</h6>
        </div>
        <div v-if="!hasConnectedBankAccount || hasFailedConnectingToGateway" class="error">Tivemos um problema ao conectar sua conta ao sistema de pagamentos. Favor entrar em contato</div>
      </div>
      <div class="bank-container">
        <div>Banco: {{ connectedAccount.bank.institution }} </div>
        <div>Agência: {{ connectedAccount.bank.agency }} </div>
        <div>Conta: {{ bankAccountNumberDisplay }} </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import { required, minLength, maxLength, alphaNum, helpers } from 'vuelidate/lib/validators';

const bankAccountNumber = helpers.regex('bankAccountNumber', /^\d+-\d{1}$/);
export default {
  data() {
    return {
      newBankAccount: {
        institution:  '',
        agency:       '',
        number:       '',
        document:     '',
        legal_name:   ''
      }
    }
  },
  validations: {
    newBankAccount: {
      institution:  { required },
      agency:       { alphaNum, required, maxLength: maxLength(5) },
      number:       { required, bankAccountNumber },
      document:     { required, minLength: minLength(14) },
      legal_name:   { required, maxLength: maxLength(30) }
    }
  },
  async created() {
    await Promise.all([
      this.loadBanks(),
      this.loadAccount()
    ]);
  },
  mounted() {
    // Initialize artist account if it's the first setup
    if (this.$empty(this.connectedAccount)) {
      this.connectedAccount = {
        bank: {},
        gateway: {}
      };
    }
  },
  computed: {
    ...mapState({ banks: (state) => state.billing.banks }),
    ...mapState({ account: (state) => state.billing.account }),
    ...mapFields('billing', { connectedAccount: 'account' }),
    hasConnectedBankAccount() {
      return ! this.$empty(this.connectedAccount) && ! this.$empty(this.connectedAccount.bank) && ! this.$empty(this.connectedAccount.gateway);
    },
    hasFailedConnectingToGateway() {
      return ! this.$empty(this.connectedAccount) && ! this.$empty(this.connectedAccount.bank) && this.$empty(this.connectedAccount.gateway);
    },
    banksOptions() {
      return this.$array.map(this.banks, (bank) => {
        return { value: bank.code, display: `${bank.code} - ${bank.name}` };
      });
    },
    bankAccountNumberDisplay() {
      return ! this.$empty(this.connectedAccount.bank) ? `***${this.connectedAccount.bank.number.substr(3,3)}***` : '';
    }
  },
    methods: {
    ...mapActions('billing', ['loadBanks', 'loadAccount', 'saveBankAccount']),  
    async saveArtistBankAccount() {
      try {
        await this.saveBankAccount(this.newBankAccount);
        this.$toast.success('Conta bancária conectada com sistema de pagamentos');
      } catch (error) {
        console.log(error);
        this.$toast.error('Tivemos um problema ao conectar sua conta bancária com nosso sistema de pagamento. Por favor revise os dados ou entre em contato com a nossa equipe');
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.light-bg {
  background: $layer5;
  padding: 4 * $space;
  border-radius: $edges;
}

.api {
  font-size: $small;
  color: $layer3;
  font-weight: $bold;

  h4, h6 {
    color: $white;
  }

  .connected {
    height: 100%;
    border: 2px solid $green;
    color: $white;
    border-radius: $edges;
    padding: $space;
  }

  .error {
    color: $error;
    border-radius: $edges;
    padding: 2 * $space;
  }
}

.bank-container {
  background: $layer2;
  max-width: 250px;
  border-radius: $edges;
  padding: 2 * $space;
  color: $white;
  font-size: $large;
}
</style>