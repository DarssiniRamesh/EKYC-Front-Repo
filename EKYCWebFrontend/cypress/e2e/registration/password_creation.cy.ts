/**
 * Epic 126321 - Password Creation
 * Reference: kavia-docs/TestCases_Epic_126321_User_Registration_and_Authentication.md
 */
describe('Registration - Password Creation', () => {
  beforeEach(() => {
    cy.visit('/register/password');
  });

  it('requires password and confirmation with strength check', () => {
    cy.get('[data-test="password-input"]').should('exist');
    cy.get('[data-test="confirm-password-input"]').should('exist');
    cy.get('[data-test="create-account-btn"]').should('be.disabled');

    cy.get('[data-test="password-input"]').type('weak');
    cy.get('[data-test="confirm-password-input"]').type('weak');
    cy.get('[data-test="password-error"]').should('contain.text', 'weak');

    cy.get('[data-test="password-input"]').clear().type('StrongP@ssw0rd!');
    cy.get('[data-test="confirm-password-input"]').clear().type('StrongP@ssw0rdX');
    cy.get('[data-test="confirm-password-error"]').should('contain.text', 'match');

    cy.get('[data-test="confirm-password-input"]').clear().type('StrongP@ssw0rd!');
    cy.get('[data-test="create-account-btn"]').should('not.be.disabled');
  });

  it('submits and navigates to login', () => {
    cy.intercept('POST', '/api/auth/register/password', { statusCode: 200, body: { created: true } }).as('createPassword');
    cy.get('[data-test="password-input"]').type('StrongP@ssw0rd!');
    cy.get('[data-test="confirm-password-input"]').type('StrongP@ssw0rd!');
    cy.get('[data-test="create-account-btn"]').click();
    cy.wait('@createPassword');
    cy.location('pathname').should('match', /\/login/);
  });
});
