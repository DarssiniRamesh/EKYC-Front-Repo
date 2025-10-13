import React, { useMemo, useState } from 'react';
import '../styles/register.css';
import { navigate } from '../utils/nav';

/**
 * PUBLIC_INTERFACE
 * RegisterMobile renders the mobile registration input and Send OTP interaction.
 * - Validates 10-digit mobile.
 * - Exposes data-test attributes used by Cypress.
 * - On success of POST /api/auth/otp/mobile/send, navigates to /register/otp?channel=mobile.
 */
export default function RegisterMobile() {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  // lightweight navigation without react-router

  const onlyDigits = (val) => val.replace(/\D/g, '');

  const onChange = (e) => {
    const digits = onlyDigits(e.target.value).slice(0, 10);
    setMobile(digits);
    // simple error messaging
    if (digits.length > 0 && digits.length < 10) {
      setError('Mobile number must be 10 digits');
    } else {
      setError('');
    }
  };

  const isValid = useMemo(() => mobile.length === 10, [mobile]);

  const sendOtp = async () => {
    if (!isValid || sending) return;
    setSending(true);
    setError('');
    try {
      const res = await window.fetch('/api/auth/otp/mobile/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json?.error || 'Failed to send OTP');
      } else {
        // persist mobile for OTP screen
        window.sessionStorage.setItem('reg_mobile', mobile);
        navigate('/register/otp?channel=mobile');
      }
    } catch (err) {
      setError('Network error, please try again');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container">
      <h1>Register - Mobile</h1>
      <div>
        <label htmlFor="mobile-input">Mobile Number</label>
        <input
          id="mobile-input"
          className="input"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          value={mobile}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby="mobile-error"
          placeholder="Enter 10-digit mobile"
          data-test="mobile-input"
        />
        <div id="mobile-error" className="error" data-test="mobile-error">
          {error}
        </div>
      </div>

      <div className="actions">
        <button
          type="button"
          className="button"
          onClick={sendOtp}
          disabled={!isValid || sending}
          data-test="send-otp-btn"
          aria-label="Send OTP"
        >
          {sending ? 'Sending…' : 'Send OTP'}
        </button>
      </div>

      <p className="helper" data-test="aadhaar-link-guidance">
        Ensure your mobile is linked to Aadhaar to proceed. Learn how to link.
      </p>
    </div>
  );
}
