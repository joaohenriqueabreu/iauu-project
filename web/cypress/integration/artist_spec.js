describe('Artist pages', () => {
  describe('Artist login', () => {
    it('should login with valid email', () => {
      cy.visit('http://localhost:3000/login')
      cy.get('input[type=email]').type('toca@raul.com.br')
      cy.get('input[type=password]').type('iauu')
      cy.get('div.button').first().click()
      cy.url().should('include', 'artist/schedule')
    })
  })

  describe('Visit artist pages', () => {
    it('should open incorporate', () => {
      cy.get('div[data-test="top-menu"]').click()
      cy.contains('Venda mais shows').click()
      cy.url().should('include', 'artist/incorporate')
    })
  })
})