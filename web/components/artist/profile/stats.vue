<template>
  <div class="vertical middle center">
    <div v-if="wontShowOnSearchResults" class="no-search-result mb-4">
      <h6>Seu perfil está incompleto e não será exibido nos resultados das buscas dos organizadores de eventos, por favor, fornece mais informações para ser encontrado</h6>
    </div>
    <h4 class="horizontal">
      Seu perfil <h4 class="mx-2" v-if="completeness === 0">está</h4><h4 class="mx-2" v-else>é</h4> <i>{{ strengthMessage }}</i>
    </h4>
    <div class="chart">
      <stats-donut :options="statsOptions" :chart-data="statsData" :height="200"></stats-donut>
    </div>
    <div class="mb-5"></div>
    <hr />
    <div class="mb-4">
      <h4>Etapas para um perfil de sucesso!</h4>
    </div>
    <div class="row full-width">
      <div class="col-sm-2"></div>
      <div class="col-sm-3">
        <div class="mb-4">
          <u >Aparecendo para os organizadores</u>
        </div>
        <div>
          <font-awesome icon="check" :class="hasPersonalInfo && hasProposalInfo ? 'check' : ''"></font-awesome>
          <span>Informações de contato e foto</span>
        </div>
        <div>
          <font-awesome icon="check" :class="hasSocialInfo ? 'check' : ''"></font-awesome>
          <span>Redes Sociais Conectadas</span>
        </div>
        <div>
          <font-awesome icon="check" :class="hasCategoryInfo ? 'check' : ''"></font-awesome>
          <span>Estilos musicais ou artísticos</span>
        </div>
        <div>
          <font-awesome icon="check" :class="hasProductsInfo ? 'check' : ''"></font-awesome>
          <span>Formatos de apresentação cadastrados</span>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="mb-4">
          <u>Primeiros passos na plataforma</u>
        </div>
        <div>
          <font-awesome icon="check" :class="hasFirstPresentation ? 'check' : ''"></font-awesome>
          <span>Primeira apresentação realizada</span>
        </div>
        <div>
          <font-awesome icon="check" :class="hasFeedbacks ? 'check' : ''"></font-awesome>
          <span>Feedbacks de clientes</span>
        </div>
        <div>
          <font-awesome icon="check"></font-awesome>
          <span>Conta verificada</span>
        </div>
        <div>
          <font-awesome icon="check"></font-awesome>
          <span>Cadastro de dados bancários</span>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="mb-4">
          <u>Vender mais shows e faturar</u>
        </div>
        <div>
          <font-awesome icon="check"></font-awesome>
          <span>Conta premium</span>
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
    profileScore() {
      return this.hasPersonalInfo + 
        this.hasSocialInfo + 
        this.hasCategoryInfo + 
        this.hasStylesInfo +
        this.hasProposalInfo + 
        this.hasProductsInfo + 
        this.hasFeedbacks
    },
    completeness() {
      return Math.round(this.profileScore / 6 * 100, 0)
    },
    profileScoreMessages() {
      return [
        'Incompleto',
        'Banda de fim de semana',
        'Sucesso do carnaval',
        'Sucesso nacional',
        'Rockstar',
        'Legião de fãs',
        'A maior banda de todos os tempos!'
      ]
    },
    strengthMessage() {
      return this.profileScoreMessages[this.profileScore]
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
    },
    hasPersonalInfo() {
      return !this.$empty(this.artist.name) && !this.$empty(this.artist.address) && !this.$empty(this.artist.photo)
    },
    hasSocialInfo() {
      return !this.$empty(this.artist.social)
    },
    hasCategoryInfo() {
      return !this.$empty(this.artist.category.name)
    },
    hasStylesInfo() {
      return !this.$empty(this.artist.category.subcategories)
    },
    hasProposalInfo() {
      return this.artist.proposal.avg_price > 0 && this.artist.proposal.avg_duration > 0
    },
    hasProductsInfo() {
      return !this.$empty(this.artist.products)
    },
    hasFeedbacks() {
      return !this.$empty(this.artist.feedbacks)
    },
    hasFirstPresentation() {
      return false
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
