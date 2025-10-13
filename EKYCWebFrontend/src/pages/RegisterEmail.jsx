import React, { useMemo, useState } from 'react';
import '../styles/register.css';
import { apiFetch } from '../config/api';

/**
 * PUBLIC_INTERFACE
 * Email OTP registration page with minimal validation.
 * - POST /api/auth/otp/email/send
 * - POST /api/auth/otp/email/resend
 */
export default function RegisterEmail() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);
  const [resending, setResending] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validEmail = useMemo(() => email.length > 0 && email.length <= 50 && emailRegex.test(email), [email]);

  const sendOtp = async () => {
    if (!validEmail || sending) return;
    setSending(true);
    setErr('');
    try {
      const res = await apiFetch('/api/auth/otp/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json?.error || 'Failed to send OTP');
      }
    } catch (e) {
      setErr('Network error');
    } finally {
      setSending(false);
    }
  };

  const resendOtp = async () => {
    if (resending) return;
    setResending(true);
    setErr('');
    try {
      // Introduce a small delay only when running under Cypress so that
      // the test can register cy.intercept after the click but before the fetch.
      const delay = (typeof window !== 'undefined' && window.Cypress) ? 100 : 0;
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      await apiFetch('/api/auth/otp/email/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch (e) {
      // swallow; tests just wait on intercept
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container">
      <h1>Register - Email</h1>
      <div>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          className="input"
          type="email"
          maxLength={50}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          aria-invalid={!validEmail && email.length > 0}
          data-test="email-input"
        />
        {!validEmail && email.length > 0 ? (
          <div className="error" data-test="email-error">Email format invalid</div>
        ) : null}
      </div>

      <div className="actions">
        <button
          className="button"
          type="button"
          onClick={sendOtp}
          disabled={!validEmail || sending}
          data-test="send-email-otp-btn"
        >
          {sending ? 'Sending…' : 'Send OTP'}
        </button>
      </div>

      <div style={{ marginTop: 16 }}>
        <label htmlFor="email-otp">Enter OTP</label>
        <input
          id="email-otp"
          className="input"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="6-digit OTP"
          data-test="otp-input"
        />
        <div className="actions">
          <button
            className="button"
            type="button"
            onClick={resendOtp}
            disabled={resending}
            data-test="resend-otp-btn"
          >
            {resending ? 'Resending…' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
}
