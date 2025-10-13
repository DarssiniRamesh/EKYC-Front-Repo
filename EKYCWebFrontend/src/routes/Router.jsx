import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterMobile from '../pages/RegisterMobile';
import RegisterOtp from '../pages/RegisterOtp';

/**
 * PUBLIC_INTERFACE
 * AppRouter defines application routes for registration mobile OTP flow.
 * Routes:
 * - /register: mobile input and Send OTP
 * - /register/otp: OTP entry and verify
 */
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterMobile />} />
        <Route path="/register/otp" element={<RegisterOtp />} />
        {/* Placeholder redirects for future steps used by Cypress */}
        <Route path="/register/password" element={<div data-test="password-creation-placeholder">Password creation placeholder</div>} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
