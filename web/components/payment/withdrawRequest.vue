<template>
  <modal ref="modal">
    <template v-slot:header>
      <h4>Solicitar saque</h4>
    </template>
    <template v-slot:main>
      <div class="mb-2 p-2">
        Aqui vem as regras de saque. Aqui vem as regras de saque. Aqui vem as regras de saque. Aqui
        vem as regras de saque. Aqui vem as regras de saque. Aqui vem as regras de saque. Aqui vem
        as regras de saque. Aqui vem as regras de saque. Aqui vem as regras de saque.
      </div>
      <div class="mb-5 p-2">
        Aqui vem as regras de saque. Aqui vem as regras de saque. Aqui vem as regras de saque. Aqui
        vem as regras de saque. Aqui vem as regras de saque. Aqui vem as regras de saque. Aqui vem
        as regras de saque. Aqui vem as regras de saque. Aqui vem as regras de saque.
      </div>
      <div class="horizontal middle px-5 py-2 mb-4">
        <h6 class="mr-4 no-cap">Seu saldo é de:</h6>
        <h4>{{ available | currency }}</h4>
      </div>
      <div class="horizontal middle px-5 py-2 mb-4">
        <form-numeric
          v-model="amount"
          label="Solicito sacar o seguinte valor"
          :max="available"
        ></form-numeric>
      </div>
    </template>
    <template v-slot:footer>
      <div class="half-width">
        <form-button @action="request">Solicitar Saque</form-button>
      </div>
    </template>
  </modal>
</template>

<script>
export default {
  props: {
    available: { type: Number, default: 0 }
  },
  data() {
    return {
      amount: { type: Number, default: 0 }
    }
  },
  methods: {
    openModal() {
      this.$refs.modal.open()
    },
    async request() {
      await this.requestWithdraw
    }
  }
}
</script>

<style></style>
