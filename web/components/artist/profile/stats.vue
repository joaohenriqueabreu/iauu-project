<template>
  <div class="vertical middle center">
    <div v-if="wontShowOnSearchResults" class="no-search-result mb-4">
      <h6>Seu perfil está incompleto e não será exibido nos resultados das buscas dos organizadores de eventos, por favor, fornece mais informações para ser encontrado</h6>
    </div>
    <h4>
      Seu perfil está <i>{{ profileStrength }}</i>
    </h4>
    <small class="mb-5">
      {{ strengthMessage }}
    </small>
    <div class="chart">
      <stats-donut :options="statsOptions" :data="statsData" :height="200"></stats-donut>
    </div>

    <div class="mb-5"></div>
    <hr />
    <div class="row full-width">
      <div class="col-sm-2"></div>
      <div class="col-sm-3">
        <div>
          <font-awesome icon="check" :class="checked(artist.name) ? 'check' : ''"></font-awesome>
          <span>Informações pessoais</span>
        </div>
        <div>
          <font-awesome icon="check" class="check"></font-awesome>
          <span>Redes Sociais Conectadas</span>
        </div>
        <div>
          <font-awesome icon="check" class="check"></font-awesome>
          <span>Estilos de Apresentação</span>
        </div>
      </div>
      <div class="col-sm-3">
        <div>
          <font-awesome icon="check" class="check"></font-awesome>
          <span>Produtos cadastrados</span>
        </div>
        <div>
          <font-awesome icon="check"></font-awesome>
          <span>Cadastro de conta bancária</span>
        </div>
        <div>
          <font-awesome icon="check"></font-awesome>
          <span>Feedbacks de clientes</span>
        </div>
      </div>
      <div class="col-sm-3">
        <div>
          <font-awesome icon="check"></font-awesome>
          <span>Conta verificada</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({ artist: (state) => state.artist.artist }),
    wontShowOnSearchResults() {
      return this.$empty(this.artist.name) || 
        this.$empty(this.artist.photo) ||
        this.$empty(this.artist.products) ||
        this.$empty(this.artist.category.name)
    },
    completeness() {
      return 60
    },
    profileStrength() {
      if (this.wontShowOnSearchResults) {
        return 'incompleto'
      }
      return 'ok'
    },
    strengthMessage() {
      return 'Inclua mais informações para que sua empresa apareça com mais frequência nas buscas'
    },
    statsData() {
      return {
        datasets: [
          {
            data: [this.completeness, 100 - this.completeness],
            backgroundColor: ['#ff990a', ''],
            borderColor: 'transparent',
            weight: 2
          }
        ]
      }
    },
    statsOptions() {
      return {
        // donut: true,
        // donutWidth: 60,
        // donutSolid: true,
        // startAngle: 270,
        // showLabel: false,
        // total: 100
      }
    }
  },
  methods: {
    checked(source) {
      return !this.$empty(source)
    }
  }
}
</script>

<style lang="scss">
.chart {
  position: relative;
  max-width: 50vw;
}
</style>

<style lang="scss" scoped>
.no-search-result {
  background: $error;
  padding: 2 * $space;
  border-radius: $edges;
  box-shadow: $shadow;
}

.row {
  div {
    div {
      @extend .horizontal, .middle;
      font-weight: $bold;
      margin-bottom: 2 * $space;
      [data-icon] {
        box-shadow: $shadow;
        border-radius: $rounded;
        font-size: $small;
        color: $layer1;
        height: 20px;
        width: 20px;
        padding: 3px;

        &.check {
          background: $brandLayer;
          color: $brand;
        }
      }
    }
  }
}
</style>
