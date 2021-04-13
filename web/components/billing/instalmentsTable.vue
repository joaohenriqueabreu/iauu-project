<template>
  <div>
    <table class="table" v-if="!$empty(billing.instalments)">
      <thead>
        <tr>
          <th>#</th>
          <th>Identificação</th>
          <th>Adiantamento?</th>
          <th>Valor</th>
          <th>Data de Vencimento</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(instalment, index) in billing.instalments" :key="index" @click="openInstalmentModal(instalment)">
          <td>{{ index + 1 }}</td>
          <td>{{ instalment.name | notEmptyString }}</td>
          <td>{{ instalment.is_upfront | yesNo }}</td>
          <td>{{ instalment.amount | currency }}</td>
          <td>{{ instalment.due_at | date }}</td>
          <td>{{ instalment.status | translate('billing.instalments.status') }}</td>
        </tr>
      </tbody>
    </table>
    <modal ref="instalment">
      <template v-slot:main>
        <instalment-manager :billing="billing" :instalment="selectedInstalment" @saved="closeInstalmentModal"></instalment-manager>
      </template>
    </modal>
  </div>
</template>

<script>
import InstalmentManager from '@/components/billing/instalmentManager';
export default {
  components: {
    InstalmentManager
  },
  props: {
    billing: {}
  },
  data() {
    return {
      selectedInstalment: {}
    }
  },
  methods: {
    openInstalmentModal(instalment) {
      this.selectedInstalment = instalment;
      this.$refs.instalment.open();
    },
    closeInstalmentModal() {
      this.selectedInstalment = {};
      this.$refs.instalment.close();
    },
  }
}
</script>

<style lang="scss" scoped>
.delete {
  z-index: $above;
}
</style>