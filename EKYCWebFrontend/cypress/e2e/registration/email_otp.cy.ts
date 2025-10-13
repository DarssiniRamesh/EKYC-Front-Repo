/**
 * Epic 126321 - Email OTP
 * Reference: kavia-docs/TestCases_Epic_126321_User_Registration_and_Authentication.md
 */
describe('Registration - Email OTP', () => {
  beforeEach(() => {
    cy.visit('/register/email');
  });

  it('should enforce valid email format and max 50 chars', () => {
    cy.get('[data-test="email-input"]').should('exist').and('have.attr', 'maxlength', '50');

    cy.get('[data-test="send-email-otp-btn"]').should('be.disabled');
    cy.get('[data-test="email-input"]').type('invalid-email');
    cy.get('[data-test="email-error"]').should('contain.text', 'invalid');

    cy.get('[data-test="email-input"]').clear().type('user@example.com');
    cy.get('[data-test="send-email-otp-btn"]').should('not.be.disabled');
  });

  it('should send OTP and allow resend', () => {
    cy.intercept('POST', '/api/auth/otp/email/send', { statusCode: 200, body: { success: true } }).as('sendEmailOtp');

    cy.get('[data-test="email-input"]').type('user@example.com');
    cy.get('[data-test="send-email-otp-btn"]').click();
    cy.wait('@sendEmailOtp');

    cy.get('[data-test="otp-input"]').should('have.attr', 'maxlength', '6');
    cy.get('[data-test="resend-otp-btn"]').should('exist').click();

    cy.intercept('POST', '/api/auth/otp/email/resend', { statusCode: 200, body: { success: true } }).as('resendEmailOtp');
    cy.wait('@resendEmailOtp');
  });
});
