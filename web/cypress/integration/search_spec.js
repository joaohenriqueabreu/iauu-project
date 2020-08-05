describe('my first test', () => {
  it('Search all artists', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Vamos lá').click()
    cy.url().should('include', 'search')
  })

  it('Search all artists', () => {
    cy.visit('http://localhost:3000')
    cy.get('input[type=text]').type('shaman')
    cy.contains('Vamos lá').click()
    cy.url().should('include', 'search')
  })
})