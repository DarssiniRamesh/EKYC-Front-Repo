# Epic 126321 - Frontend E2E (Cypress)

Authoritative test cases: kavia-docs/TestCases_Epic_126321_User_Registration_and_Authentication.md

What’s included
- Cypress config with baseUrl http://localhost:3000
- Spec grouping by story:
  - cypress/e2e/registration/mobile_otp.cy.ts
  - cypress/e2e/registration/email_otp.cy.ts
  - cypress/e2e/registration/password_creation.cy.ts
  - cypress/e2e/auth/login.cy.ts
  - cypress/e2e/auth/password_recovery.cy.ts
  - cypress/e2e/validation/inputs.cy.ts
- Tests stub backend calls via cy.intercept.
- Intentional failing assertions to drive UI (elements and validations).

Conventions
- Add data-test attributes in UI components referenced in tests, e.g.:
  - [data-test="mobile-input"], [data-test="send-otp-btn"], [data-test="otp-input"], etc.
- Update intercepted URLs once backend endpoints are finalized.

Run locally
- Start app: npm start
- Open Cypress: npm run test:e2e
- CI mode (headless): npm run test:e2e:headless
