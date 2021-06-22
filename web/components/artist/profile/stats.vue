<template>
  <div class="vertical middle center">
    <div v-if="wontShowOnSearchResults" class="no-search-result mb-4">
      <h6>Seu perfil está incompleto e não será exibido nos resultados das buscas dos organizadores de eventos, por favor, forneça mais informações para ser encontrado</h6>
    </div>
    <h4 class="horizontal">
      <!-- Seu perfil <h4 class="mx-2" v-if="completeness === 0">está</h4><h4 class="mx-2" v-else>é</h4> <i>{{ strengthMessage }}</i> -->
      Força do seu Perfil
    </h4>
    <div><small>Capacidade de seu perfil ser encontrado por contratantes em nossa ferramenta de busca</small></div>
    <div class="chart">
      <stats-donut :options="statsOptions" :chart-data="statsData" :height="200"></stats-donut>
    </div>
    <div class="mb-5"></div>
    <hr />
    <div class="mb-4">
      <h4>Etapas para um perfil de sucesso!</h4>
    </div>
    <carousel :navigate="false">
      <slide class="mr-5 profile-success-steps">
        <div class="mb-4">
          <u>Aparecendo para os organizadores</u>
        </div>
        <div>
          <icon icon="check" :class="hasPersonalInfo ? 'check' : ''"></icon>
          <span>Informações de contato e foto</span>
        </div>
        <div>
          <icon icon="check" :class="hasSocialInfo ? 'check' : ''"></icon>
          <span>Redes Sociais Conectadas</span>
        </div>
        <div>
          <icon icon="check" :class="hasCategoryInfo ? 'check' : ''"></icon>
          <span>Estilos musicais ou artísticos</span>
        </div>
        <div>
          <icon icon="check" :class="hasProductsInfo ? 'check' : ''"></icon>
          <span>Formatos de apresentação cadastrados</span>
        </div>
      </slide>
      <slide class="mr-5 profile-success-steps">
        <div class="mb-4">
          <u>Primeiros passos na plataforma</u>
        </div>
        <div>
          <icon icon="check" :class="hasFirstPresentation ? 'check' : ''"></icon>
          <span>Primeira apresentação realizada</span>
        </div>
        <div>
          <icon icon="check" :class="hasFeedbacks ? 'check' : ''"></icon>
          <span>Feedbacks de clientes</span>
        </div>
        <div>
          <icon icon="check"></icon>
          <span>Conta verificada</span>
        </div>
        <div>
          <icon icon="check" :class="hasConnectedBankAccount ? 'check' : ''"></icon>
          <span>Cadastro de dados bancários</span>
        </div>
      </slide>
      <slide class="mr-5 profile-success-steps">
        <div class="mb-4">
          <u>Vender mais shows e faturar</u>
        </div>
        <div>
          <icon icon="check"></icon>
          <span>Conta premium</span>
        </div>
        <div>
          <icon icon="check"></icon>
          <span>Acompanhamento diário de relatórios e estatísticas</span>
        </div>
        <div>
          <icon icon="check"></icon>
          <span>Realize seu primeiro saque na plataforma</span>
        </div>
        <div>
          <icon icon="check"></icon>
          <span></span>
        </div>
      </slide>
    </carousel>
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
      return this.artist.has_closed_first_presentation;
    },
    hasConnectedBankAccount() {
      return !this.$empty(this.artist.account) && !this.$empty(this.artist.account.bank) && !this.$empty(this.artist.account.gateway);
    }
  },
  methods: {
    checked(source) {
      return !this.$empty(source);
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

.profile-success-steps {
  box-shadow: $shadow;
  background: $layer5;
  padding: 4 * $space;
  margin: 4 * $space;

  u { 
    font-weight: $bold;
  }

  div {
    // @extend .horizontal, .middle;
    // font-weight: $bold;
    margin-bottom: 2 * $space;
  }

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
</style>
