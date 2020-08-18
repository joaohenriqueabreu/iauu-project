<template>
  <div class="feedback" v-if="!hidden">
    <header class="header">
      <h6 class="d-flex justify-content-between mb-3">
        <div>
          <font-awesome icon="flask" class="mr-2"></font-awesome> Estamos em <span class="beta">beta</span>
        </div>
        <div>
          <font-awesome :icon="minimized ? 'angle-up' : 'angle-down'" class="clickable" @click="minimized=!minimized"></font-awesome>
        </div>
      </h6>
      <div>
        Por favor nos dê um rápido feedback sobre a plataforma
        <u class="clickable" @click="dontShow">Não mostrar mais</u>
      </div>
    </header>
    <main v-if="!minimized">
      <div class="mt-2"></div>
      <form-select class="mb-2" :allow-input="false" :options="origins" v-model="feedback.origin">
        Como você nos conheceu?
      </form-select>
      <form-textarea class="mb-2" v-model="feedback.comments" placeholder="Se estiver reportando um erro, seria incrível se puder nos descrever os passos para podermos reproduzí-lo">
        O que tem achado da plataforma?
      </form-textarea>
      <form-button @action="send">Enviar</form-button>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hidden: false,
      minimized: true,
      feedback: {
        origin: '',
        comments: ''
      }
    }
  },
  computed: {
    origins() {
      return [
        'Facebook',
        'Instagram',
        'Nosso site',
        'Blog',
        'Outros'
      ]
    }
  },
  mounted() {
    this.hidden = localStorage.getItem('hide-feedback')
  },
  methods: {
    dontShow() {
      localStorage.setItem('hide-feedback', true)
      this.hidden = true
      this.$toast.info('Sem problemas! Não iremos mostrar mais a barra de feedback.')
    },
    send() {
      this.minimized = true
      this.$toast.success('Seu feedback é muito importante para nós. Obrigado!')
    }
  }
}
</script>

<style lang="scss" scoped>
.beta {
  background: $layer5;
  border-radius: $rounded;
  padding: $space;
}

.feedback {
  position: fixed;
  bottom: 0;
  right: 0;
  transition: $transition;
  background: $layer3;
  border-top-left-radius: $edges;
  border-top-right-radius: $edges;
  padding: 2 * $space;
  @include desktop {
    margin-right: 2 * $space;
    width: 25vw;
  }

  header {
    margin-bottom: 2 * $space;
  }

  main {
    padding: $space;
  }
}
</style>