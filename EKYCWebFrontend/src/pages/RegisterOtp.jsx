import React, { useEffect, useMemo, useState } from 'react';
import '../styles/register.css';
import { getSearchParams, navigate } from '../utils/nav';
import { apiFetch } from '../config/api';

/**
 * PUBLIC_INTERFACE
 * RegisterOtp renders OTP entry and handles verify/resend calls.
 * - POST /api/auth/otp/mobile/verify with { mobile, otp }
 * - Resend uses POST /api/auth/otp/mobile/send with { mobile }
 * On successful verification, navigates to /register/password (placeholder route).
 */
export default function RegisterOtp() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  // lightweight helpers

  // retrieve mobile from session
  const [mobile, setMobile] = useState('');
  useEffect(() => {
    const stored = window.sessionStorage.getItem('reg_mobile') || '';
    setMobile(stored);
  }, []);

  const onlyDigits = (val) => val.replace(/\D/g, '');

  const onChangeOtp = (e) => {
    const digits = onlyDigits(e.target.value).slice(0, 6);
    setOtp(digits);
    setError('');
    setInfo('');
  };

  const isValidOtp = useMemo(() => otp.length === 6, [otp]);

  const verifyOtp = async () => {
    if (!isValidOtp || verifying) return;
    setVerifying(true);
    setError('');
    setInfo('');
    try {
      const res = await apiFetch('/api/auth/otp/mobile/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || 'Invalid OTP. Please try again.');
      } else {
        setInfo('OTP verified successfully.');
        // proceed to password creation step (Cypress expects navigation)
        navigate('/register/password');
      }
    } catch (err) {
      setError('Network error, please try again');
    } finally {
      setVerifying(false);
    }
  };

  const resendOtp = async () => {
    if (resending) return;
    setResending(true);
    setError('');
    setInfo('');
    try {
      await apiFetch('/api/auth/otp/mobile/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });
      setInfo('OTP resent.');
    } catch (err) {
      setError('Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container">
      <h1>Enter OTP</h1>
      <p className="helper">Channel: {getSearchParams().get('channel') || 'mobile'}</p>
      <div>
        <label htmlFor="otp-input">One-Time Password</label>
        <input
          id="otp-input"
          className="input"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={otp}
          onChange={onChangeOtp}
          placeholder="Enter 6-digit OTP"
          data-test="otp-input"
        />
      </div>
      {error ? <div className="error" data-test="otp-error">{error}</div> : null}
      {info ? <div className="success" data-test="otp-info">{info}</div> : null}

      <div className="actions">
        <button
          type="button"
          className="button"
          onClick={verifyOtp}
          disabled={!isValidOtp || verifying}
          data-test="verify-otp-btn"
          aria-label="Verify OTP"
        >
          {verifying ? 'Verifying…' : 'Verify OTP'}
        </button>
        <button
          type="button"
          className="button"
          onClick={resendOtp}
          disabled={resending}
          data-test="resend-otp-btn"
          aria-label="Resend OTP"
        >
          {resending ? 'Resending…' : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
}
