import React, { useMemo, useState } from 'react';
import '../styles/register.css';
import { getSearchParams, navigate } from '../utils/nav';
import { apiFetch } from '../config/api';

/**
 * PUBLIC_INTERFACE
 * Password reset page that accepts token via query or OTP field.
 * - POST /api/auth/password/reset
 * On success navigate to /login
 */
export default function PasswordReset() {
  const [otp, setOtp] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const token = getSearchParams().get('token') || '';

  const validPwd = useMemo(() => pwd.length >= 6, [pwd]);
  const match = useMemo(() => confirm === pwd, [confirm, pwd]);
  const canSubmit = useMemo(() => validPwd && match && (otp.length === 6 || token), [validPwd, match, otp, token]);

  const onSubmit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setErr('');
    try {
      const res = await apiFetch('/api/auth/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, otp, newPassword: pwd })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json?.error || 'Reset failed');
      } else {
        navigate('/login');
      }
    } catch (e) {
      setErr('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Reset Password</h1>
      <div>
        <label htmlFor="reset-otp">OTP</label>
        <input
          id="reset-otp"
          className="input"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter 6-digit OTP"
          data-test="reset-otp-input"
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <label htmlFor="new-password">New Password</label>
        <input
          id="new-password"
          type="password"
          className="input"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="New password"
          data-test="new-password-input"
        />
      </div>
      <div style={{ marginTop: 10 }}>
        <label htmlFor="confirm-new-password">Confirm New Password</label>
        <input
          id="confirm-new-password"
          type="password"
          className="input"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm new password"
          data-test="confirm-new-password-input"
        />
      </div>
      {err ? <div className="error" data-test="reset-error">{err}</div> : null}
      <div className="actions">
        <button
          className="button"
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || loading}
          data-test="reset-password-btn"
        >
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
}
