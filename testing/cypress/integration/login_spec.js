describe('User Login', () => {
  it('should login with valid email', () => {
    cy.visit('/login')
    cy.get('input[type=email]').type('toca@raul.com.br')
    cy.get('input[type=password]').type('iauu')
    cy.get('div.button').first().click()
    cy.url().should('include', 'artist/schedule')
  })

  it('should not login with invalid email', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('div.error').should('not.exist')
    cy.get('input[type=email]').type('notvalid@iauu.com.br')
    cy.get('input[type=password]').type('iauu')
    cy.get('div.button').first().click()
    cy.get('div.error').should('be.visible')
  })

  it('should not login with invalid password', () => {
    cy.visit('http://localhost:3000/login')
    cy.get('div.error').should('not.exist')
    cy.get('input[type=email]').type('andre@shaman.com')
    cy.get('input[type=password]').type('not a valid pwd')
    cy.get('div.button').first().click()
    cy.get('div.error').should('be.visible')
  })  
})

describe('User Registration', () => {
  it('should send register request', () => {
    cy.visit('http://localhost:3000/register')
    cy.get('input[type=text]').type('Cypress testing user')
    cy.get('input[type=email]').type('cypress@iauu.com.br')
    cy.get('input[type=password]').first().type('iauu')
    cy.get('input[type=password]').eq(1).type('iauu')
    cy.get('input[type=checkbox]').next('span').click()
    cy.get('div.button').first().click()
    cy.url().should('include', 'register/verify')
    cy.contains('Enviamos um link para seu email com as instruções de login')
  })
})