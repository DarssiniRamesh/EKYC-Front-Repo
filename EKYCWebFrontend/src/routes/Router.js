import React, { useEffect, useState } from 'react';
import RegisterMobile from '../pages/RegisterMobile';
import RegisterOtp from '../pages/RegisterOtp';
import RegisterEmail from '../pages/RegisterEmail';
import RegisterPassword from '../pages/RegisterPassword';
import Login from '../pages/Login';
import PasswordRecovery from '../pages/PasswordRecovery';
import PasswordReset from '../pages/PasswordReset';

/**
 * PUBLIC_INTERFACE
 * Router fallback without react-router-dom for CI environments where the dependency is not available.
 * This lightweight router uses location state and popstate listener to re-render on navigation.
 * Supported paths now include:
 * - /register, /register/otp, /register/email, /register/password
 * - /login
 * - /password/recovery, /password/reset
 * - /dashboard (placeholder)
 * Any other path renders /register.
 */
export default function Router() {
  const getPath = () =>
    typeof window !== 'undefined' ? window.location.pathname + (window.location.search || '') : '/register';

  const [currentPath, setCurrentPath] = useState(getPath());

  useEffect(() => {
    const onPopState = () => setCurrentPath(getPath());
    window.addEventListener('popstate', onPopState);
    setCurrentPath(getPath());
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  if (currentPath.startsWith('/register/otp')) return <RegisterOtp />;
  if (currentPath.startsWith('/register/email')) return <RegisterEmail />;
  if (currentPath.startsWith('/register/password')) return <RegisterPassword />;
  if (currentPath.startsWith('/password/recovery')) return <PasswordRecovery />;
  if (currentPath.startsWith('/password/reset')) return <PasswordReset />;
  if (currentPath.startsWith('/login')) return <Login />;
  if (currentPath.startsWith('/dashboard')) {
    return <div className="container"><h1>Dashboard</h1><p>Welcome.</p></div>;
  }
  if (currentPath === '/' || currentPath.startsWith('/register')) return <RegisterMobile />;

  // Fallback
  return <RegisterMobile />;
}
