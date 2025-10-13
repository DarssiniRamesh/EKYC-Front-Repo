/**
 * Epic 126321 - User Registration & Authentication
 * Source of truth for scenarios: kavia-docs/TestCases_Epic_126321_User_Registration_and_Authentication.md
 *
 * Notes for implementers:
 * - Add data-test attributes to inputs/buttons referenced here (e.g., data-test="mobile-input").
 * - Replace intercepted URLs with actual backend routes when available.
 */

describe('Registration - Mobile OTP', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should enforce 10-digit mobile and enable Send OTP only when valid', () => {
    // Expect element to exist; currently likely missing - this assertion will drive UI creation
    cy.get('[data-test="mobile-input"]').should('exist').and('have.attr', 'maxlength', '10');

    // Button disabled until valid number
    cy.get('[data-test="send-otp-btn"]').should('exist').and('be.disabled');
    cy.get('[data-test="mobile-input"]').type('123456789'); // 9 digits (invalid)
    cy.get('[data-test="send-otp-btn"]').should('be.disabled');

    cy.get('[data-test="mobile-input"]').clear().type('9876543210'); // 10 digits valid
    cy.get('[data-test="send-otp-btn"]').should('not.be.disabled');
  });

  it('should request OTP and navigate to OTP entry screen', () => {
    cy.intercept('POST', '/api/auth/otp/mobile/send', {
      statusCode: 200,
      body: { success: true, requestId: 'req-123' }
    }).as('sendMobileOtp');

    cy.get('[data-test="mobile-input"]').type('9876543210');
    cy.get('[data-test="send-otp-btn"]').click();
    cy.wait('@sendMobileOtp');

    // OTP screen assertions
    cy.get('[data-test="otp-input"]').should('exist').and('have.attr', 'maxlength', '6');
    cy.get('[data-test="verify-otp-btn"]').should('be.disabled');

    cy.get('[data-test="resend-otp-btn"]').should('exist');
  });

  it('should validate OTP and proceed on success', () => {
    cy.intercept('POST', '/api/auth/otp/mobile/verify', (req) => {
      expect(req.body).to.have.property('otp');
      req.reply({ statusCode: 200, body: { verified: true } });
    }).as('verifyMobileOtp');

    // Precondition: assume already on OTP screen
    cy.visit('/register/otp?channel=mobile');
    cy.get('[data-test="otp-input"]').type('123456'); // 6 digits
    cy.get('[data-test="verify-otp-btn"]').click();
    cy.wait('@verifyMobileOtp');

    // Expect navigation to password creation step
    cy.location('pathname').should('match', /\/register\/password/);
  });

  it('should show error for invalid/duplicate mobile', () => {
    cy.intercept('POST', '/api/auth/otp/mobile/send', {
      statusCode: 400,
      body: { error: 'Duplicate or invalid mobile' }
    }).as('sendMobileOtpFail');

    cy.get('[data-test="mobile-input"]').type('9876543210');
    cy.get('[data-test="send-otp-btn"]').click();
    cy.wait('@sendMobileOtpFail');

    cy.get('[data-test="mobile-error"]').should('contain.text', 'Duplicate or invalid mobile');
  });
});
