<template>
  <div>
    <div class="boxed d-flex flex-column justify-content-between mb-5">
      <div class="mb-4">
        <h4>Total não alocado</h4>
        <small>Valor não associado a uma forma de pagamento - o contratante ainda poderá pagar a apresentação a vista</small>
      </div>
      
      <h2 class="text-right">{{ billing.amount_unallocated | currency }}</h2>
    </div>
    <div>
      <h6 class="mb-4">Informe os detalhes da forma de pagamento negociada com seu contratante para esta apresentação:</h6>
      <form-input v-model="targetInstalment.name" placeholder="Nome (opcional) - Ex: Entrada, Fechamento" icon="signature"></form-input>
      <div class="row">
        <form-checkbox class="col-4" v-model="targetInstalment.is_upfront">
          <div><b>É adiantamento?</b></div>
        </form-checkbox>
        <form-money class="col-4" v-model="$v.targetInstalment.amount.$model" placeholder="Valor da parcela (R$)"></form-money>
        <form-date class="col-4" v-model="$v.targetInstalment.due_at.$model" placeholder="Vencimento da parcela"></form-date>
      </div>
      <form-validation :active="$v.targetInstalment.amount.$error">Valor da parcela inválido. Entre com um valor até {{ billing.amount_unallocated | currency }} (total disponível para alocação)</form-validation>
      <form-validation :active="$v.targetInstalment.due_at.$error">Forneça uma data de vencimento da parcela futura e válida (Mínimo de 3 dias a partir da data de hoje)</form-validation>
    </div>
    <div>
      <form-textarea v-model="targetInstalment.notes" placeholder="Notas sobre a parcela"></form-textarea>
    </div>
    <div class="horizontal middle center mt-5">
      <form-button @action="createOrUpdateInstalment" :disabled="$v.targetInstalment.$invalid" class="mr-4">{{ !$empty(instalment) ? 'Atualizar' : 'Adicionar' }} forma de pagamento</form-button>
      <form-button v-if="isUpdating" :processing="processing" @action="confirmRemovingInstalment">Remover</form-button>
    </div>
    <confirm-dialog ref="removeInstalmentDialog" message="Deseja remover esta parcela?" @confirmed="removeInstalment" @cancelled="processing=false"></confirm-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions } from 'vuex';
import { required, numeric, minValue, maxValue } from 'vuelidate/lib/validators';

const isFutureDt = (value) => {
  return moment(value).diff(moment(), 'days') > 3;
};

export default {
  props: {
    billing: {},
    instalment: {}
  },
  data() {
    return {
      targetInstalment: {},
      processing:       false,
    }
  },
  computed: {
    newInstalment() {
      return { 
        name:       '', 
        amount:     '', 
        due_at:     '',
        notes:      '',
        is_upfront: false,
      }
    },
    isUpdating() {
      return ! this.$empty(this.instalment);
    }
  },
  mounted() {
    this.targetInstalment = this.$object.clone(this.isUpdating ? this.instalment : this.newInstalment);
  },
  validations() {
    const maxAllowed = this.billing.amount_unallocated;
    return {
      targetInstalment: {
        amount: { 
          required, 
          numeric,
          minValue: minValue(1),
          maxValue: maxValue(maxAllowed)
        },
        due_at: { required, isFutureDt },
      }
    }
  },
  methods: {
    ...mapActions('billing', ['saveInstalments']),
    confirmRemovingInstalment() {
      this.processing = true;

      if (this.instalment.is_paid) { 
        this.$toast.error('Parcela já quitada não pode ser removida'); 
        return;
      }

      this.$refs.removeInstalmentDialog.show();
    },
    getInstalmentIndex() {
      const self = this;
      return this.$array.findIndex(this.billing.instalments, (instalment) => instalment.id === self.targetInstalment.id);
    },
    async createOrUpdateInstalment() {
      this.processing = true;

      // Copy billing instalments
      let instalments = this.$object.clone(this.billing.instalments);

      // upsert instalments on billing instalments array
      let instalmentIndex = this.getInstalmentIndex();
      if (instalmentIndex === -1) { instalmentIndex = 0; }

      this.$set(instalments, instalmentIndex, this.targetInstalment);

      try {
        await this.saveInstalments({ billingId: this.billing.id, instalments: instalments});
        this.processing = false;
        this.$toast.success('Forma de pagamento criada com sucesso!');
        this.$emit('saved');
      } catch (error) {
        console.log(error);
        this.$toast.error('Tivemos um problema ao salvar sua forma de pagamento');
      }
    },
    async removeInstalment() {
      // Copy billing instalments
      let instalments = this.$object.clone(this.billing.instalments);
      this.$delete(instalments, this.getInstalmentIndex());

      try {
        await this.saveInstalments({ billingId: this.billing.id, instalments: instalments});
        this.processing = false;
        this.$refs.removeInstalmentDialog.hide();
        this.$toast.success('Forma de pagamento removida. O total retornará para o saldo não alocado da apresentação.');
        this.$emit('saved');
      } catch (error) {
        console.log(error);
        this.$toast.error('Tivemos um problema ao remover esta forma de pagamento.');
      }
    }
  }
}
</script>