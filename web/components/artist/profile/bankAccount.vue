<template>
  <div>
    <h6 class="mb-2">Informe seus dados bancários para receber transferências pela nossa plataforma</h6>
    <div class="mb-4">Transferências podem levar até 5 dias úteis para sua conta</div>
    <div class="light-bg position-relative">
      <div class="position-absolute top-right">
          <font-awesome :icon="edit ? 'times': 'edit'" class="clickable" @click="editBankAccount"></font-awesome>
        </div>
      <div v-if="edit">
        <form-select v-model="bankAccount.institution" :options="banks"></form-select>
        <form-input></form-input>
      </div>
      <div v-else>
        <div v-if="!$empty(bankAccount)">
          Banco: {{  }}
        </div>
        <div v-else>
          Nenhuma informação cadastrada.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';
export default {
  async created() {
    const { data } = await this.$axios.get('data/banks');
    this.banks = data;
  },
  data() {
    return {
      banks: [],
      edit: false
    }
  },
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    ...mapFields('artist', {
      bankAccount: 'artist.bank_account',
    })
  },
  methods: {
    editBankAccount() {
      if (this.edit) { 
        this.edit = false;
        return;
      }

      // Renew Bank Account
      this.bankAccount = {};
      this.edit = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.light-bg {
  background: $layer5;
  padding: 4 * $space;
  border-radius: $edges;
}
</style>