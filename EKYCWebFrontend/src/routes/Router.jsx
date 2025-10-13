import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterMobile from '../pages/RegisterMobile';
import RegisterOtp from '../pages/RegisterOtp';
import RegisterEmail from '../pages/RegisterEmail';
import RegisterPassword from '../pages/RegisterPassword';
import Login from '../pages/Login';
import PasswordRecovery from '../pages/PasswordRecovery';
import PasswordReset from '../pages/PasswordReset';

/**
 * PUBLIC_INTERFACE
 * AppRouter defines application routes for registration/auth flows.
 */
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterMobile />} />
        <Route path="/register/otp" element={<RegisterOtp />} />
        <Route path="/register/email" element={<RegisterEmail />} />
        <Route path="/register/password" element={<RegisterPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password/recovery" element={<PasswordRecovery />} />
        <Route path="/password/reset" element={<PasswordReset />} />
        <Route path="/dashboard" element={<div className="container"><h1>Dashboard</h1></div>} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
