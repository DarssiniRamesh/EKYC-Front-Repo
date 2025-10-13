import React, { useEffect, useState } from 'react';
import RegisterMobile from '../pages/RegisterMobile';
import RegisterOtp from '../pages/RegisterOtp';

/**
 * PUBLIC_INTERFACE
 * Router fallback without react-router-dom for CI environments where the dependency is not available.
 * This lightweight router uses location state and popstate listener to re-render on navigation.
 * Supported paths:
 * - /register
 * - /register/otp
 * Any other path renders /register.
 */
export default function Router() {
  // Track current path so component re-renders on history changes and programmatic navigation.
  const getPath = () =>
    typeof window !== 'undefined' ? window.location.pathname + (window.location.search || '') : '/register';

  const [currentPath, setCurrentPath] = useState(getPath());

  useEffect(() => {
    // Handle browser navigation (back/forward) and programmatic changes triggered via utils/nav.navigate
    const onPopState = () => setCurrentPath(getPath());
    window.addEventListener('popstate', onPopState);

    // In case something else updated the URL before mount, sync once.
    setCurrentPath(getPath());

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  if (currentPath.startsWith('/register/otp')) {
    return <RegisterOtp />;
  }

  // Placeholder route for password creation used by Cypress expectations
  if (currentPath.startsWith('/register/password')) {
    return <div data-test="password-creation-placeholder">Password creation placeholder</div>;
  }

  // Default
  return <RegisterMobile />;
}
