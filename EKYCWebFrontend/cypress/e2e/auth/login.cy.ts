/**
 * Epic 126321 - Login
 * Reference: kavia-docs/TestCases_Epic_126321_User_Registration_and_Authentication.md
 */
describe('Authentication - Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('accepts mobile/email and password with validation', () => {
    cy.get('[data-test="identifier-input"]').should('exist');
    cy.get('[data-test="password-input"]').should('exist');
    cy.get('[data-test="login-btn"]').should('be.disabled');

    cy.get('[data-test="identifier-input"]').type('user@example.com');
    cy.get('[data-test="password-input"]').type('WrongPass1!');
    cy.get('[data-test="login-btn"]').should('not.be.disabled');
  });

  it('shows error for invalid credentials', () => {
    cy.intercept('POST', '/api/auth/login', { statusCode: 401, body: { error: 'Invalid credentials' } }).as('loginFail');
    cy.get('[data-test="identifier-input"]').type('user@example.com');
    cy.get('[data-test="password-input"]').type('WrongPass1!');
    cy.get('[data-test="login-btn"]').click();
    cy.wait('@loginFail');
    cy.get('[data-test="login-error"]').should('contain.text', 'Invalid credentials');
  });

  it('navigates to dashboard on success and provides password recovery link', () => {
    cy.get('[data-test="password-recovery-link"]').should('exist');
    cy.intercept('POST', '/api/auth/login', { statusCode: 200, body: { token: 'abc' } }).as('loginOk');
    cy.get('[data-test="identifier-input"]').clear().type('user@example.com');
    cy.get('[data-test="password-input"]').clear().type('StrongP@ssw0rd!');
    cy.get('[data-test="login-btn"]').click();
    cy.wait('@loginOk');
    cy.location('pathname').should('match', /\/dashboard/);
  });
});
