/**
 * Epic 126321 - Password Recovery
 * Reference: kavia-docs/TestCases_Epic_126321_User_Registration_and_Authentication.md
 */
describe('Authentication - Password Recovery', () => {
  it('allows requesting recovery and resetting password', () => {
    cy.visit('/password/recovery');

    cy.get('[data-test="recovery-identifier-input"]').should('exist');
    cy.get('[data-test="send-recovery-btn"]').should('be.disabled');
    cy.get('[data-test="recovery-identifier-input"]').type('user@example.com');
    cy.intercept('POST', '/api/auth/password/recovery', { statusCode: 200, body: { success: true } }).as('requestRecovery');
    cy.get('[data-test="send-recovery-btn"]').click();
    cy.wait('@requestRecovery');

    cy.visit('/password/reset?token=test-token');
    cy.get('[data-test="new-password-input"]').type('StrongP@ssw0rd!');
    cy.get('[data-test="confirm-new-password-input"]').type('StrongP@ssw0rd!');
    cy.intercept('POST', '/api/auth/password/reset', { statusCode: 200, body: { success: true } }).as('resetPassword');
    cy.get('[data-test="reset-password-btn"]').click();
    cy.wait('@resetPassword');
    cy.location('pathname').should('match', /\/login/);
  });
});
