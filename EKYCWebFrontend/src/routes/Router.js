import React from 'react';
import RegisterMobile from '../pages/RegisterMobile';
import RegisterOtp from '../pages/RegisterOtp';

/**
 * PUBLIC_INTERFACE
 * Router fallback without react-router-dom for CI environments where the dependency is not available.
 * This naive router switches views based on window.location.pathname to unblock build/tests.
 * Supported paths:
 * - /register
 * - /register/otp
 * Any other path renders /register.
 */
export default function Router() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/register';

  if (path.startsWith('/register/otp')) {
    return <RegisterOtp />;
  }
  return <RegisterMobile />;
}
