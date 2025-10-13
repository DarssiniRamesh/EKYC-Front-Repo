import React, { useMemo, useState } from 'react';
import '../styles/register.css';
import { navigate } from '../utils/nav';
import { apiFetch } from '../config/api';

/**
 * PUBLIC_INTERFACE
 * Login page stub with required selectors and minimal validation.
 * - POST /api/auth/login
 * On success: navigate to /dashboard
 */
export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => identifier.trim().length > 0 && password.length >= 6, [identifier, password]);

  const onSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setErr('');
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json?.error || 'Login failed');
      } else {
        navigate('/dashboard');
      }
    } catch (e) {
      setErr('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <div>
        <label htmlFor="identifier">Email or Mobile</label>
        <input
          id="identifier"
          className="input"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter email or mobile"
          data-test="identifier-input"
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          data-test="password-input"
        />
      </div>
      {err ? (
        <div className="error" data-test="login-error" style={{ marginTop: 8 }}>
          {err}
        </div>
      ) : null}
      <div className="actions">
        <button
          className="button"
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || loading}
          data-test="login-btn"
        >
          {loading ? 'Signing in…' : 'Login'}
        </button>
        <button
          className="button"
          type="button"
          onClick={() => navigate('/password/recovery')}
          data-test="password-recovery-link"
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
}
