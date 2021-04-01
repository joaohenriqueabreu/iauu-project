// const self = this
describe('Artist pages', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.window().should('have.property', 'appReady', true)
    cy.window().then(async (window) => {
      await window.nuxtApp.$auth.loginWith('user', { data: { email: 'toca@raul.com.br',  password: 'password' }})
    })
  })

  describe('Visit artist pages', () => {
    it('should open schedule', () => {
      cy.visit('/artist/schedule')
      cy.contains('Interaja com seus próximos eventos e responda a propostas de clientes').should('be.visible')
    })

    it('should open incorporate', () => {
      cy.visit('/artist/incorporate')
      cy.contains('Contrate agora nosso espetáculo').should('be.visible')
    })

    it('should open products', () => {
      cy.visit('/artist/products')
      cy.contains('Adicione Formatos').should('be.visible')
    })

    it('should open referral', () => {
      cy.visit('/referral')
      cy.contains('Compartilhe o link abaixo e receba').should('be.visible')
    })

    it('should open profile', () => {
      cy.visit('/artist/profile')
      cy.get('a.nav-link').contains('Geral').click()
      cy.contains('Seu perfil está').should('be.visible')

      cy.get('a.nav-link').contains('Informações').click()
      cy.contains('Nome da Empresa').should('be.visible')

      cy.get('a.nav-link').contains('Apresentações').click()
      cy.contains('Selecione a faixa de preços').should('be.visible')

      cy.get('a.nav-link').contains('Redes Sociais').click()
      cy.contains('Conecte suas redes sociais').should('be.visible')

      cy.get('a.nav-link').contains('Integrantes').click()
      cy.contains('Compartilhe o link abaixo com os integrantes').should('be.visible')

      cy.get('a.nav-link').contains('Categorias').click()
      cy.contains('Qual tipo de apresentação').should('be.visible')

      cy.get('a.nav-link').contains('Pesquisa').click()
      cy.contains('Escolha palavras-chave que estão associadas').should('be.visible')
    })
  })
})