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
        <tr v-for="(instalment, index) in billing.instalments" :key="index" @click="$emit('selected', instalment)">
          <td>{{ instalment.num}}</td>
          <td>{{ instalment.name | notEmptyString }}</td>
          <td>{{ instalment.is_upfront | yesNo }}</td>
          <td>{{ instalment.amount | currency }}</td>
          <td>{{ instalment.due_at | date }}</td>
          <td>{{ instalment.status | translate('billing.instalments.status') }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    billing: {}
  },
  data() {
    return {
      selectedInstalment: {}
    }
  }
}
</script>

<style lang="scss" scoped>
.delete {
  z-index: $above;
}
</style>