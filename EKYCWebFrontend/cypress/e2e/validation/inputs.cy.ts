/**
 * Epic 126321 - Input Validation and User Guidance
 * Reference: kavia-docs/TestCases_Epic_126321_User_Registration_and_Authentication.md
 */
describe('Validation - Inputs and Guidance', () => {
  it('blocks proceed until all validations pass', () => {
    cy.visit('/register');
    cy.get('[data-test="mobile-input"]').type('123'); // invalid
    cy.get('[data-test="send-otp-btn"]').should('be.disabled');
    cy.get('[data-test="mobile-error"]').should('exist');

    cy.get('[data-test="mobile-input"]').clear().type('9876543210');
    cy.get('[data-test="send-otp-btn"]').should('not.be.disabled');

    // Guidance/help text
    cy.get('[data-test="aadhaar-link-guidance"]').should('contain.text', 'link');
  });
});
