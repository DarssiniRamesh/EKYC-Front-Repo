import React, { useState, useEffect } from 'react';

export default function RegisterMobile() {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [maskedMobile, setMaskedMobile] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const [error, setError] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);

  useEffect(() => {
    let t;
    if (resendIn > 0) {
      t = setInterval(() => setResendIn((v) => (v > 0 ? v - 1 : 0)), 1000);
    }
    return () => clearInterval(t);
  }, [resendIn]);

  const sendOtp = async () => {
    setError('');
    if (!/^\d{10}$/.test(mobile)) {
      setError('Enter 10 digit mobile');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/mobile/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (res.status === 429 && json.nextAllowedIn) {
          setResendIn(json.nextAllowedIn);
        }
        throw new Error(json.error || 'Failed to send OTP');
      }
      setRequestId(json.requestId);
      setMaskedMobile(json.maskedMobile);
      setResendIn(json.nextResendIn || 60);
      setExpiresIn(json.expiresIn || 300);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Register - Mobile</h2>
      <div>
        <label>Mobile (10 digits): </label>
        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="9876543210"
        />
        <button onClick={sendOtp} disabled={loading || resendIn > 0}>
          {loading ? 'Sending…' : resendIn > 0 ? `Resend in ${resendIn}s` : 'Send OTP'}
        </button>
      </div>
      {requestId && (
        <div style={{ marginTop: 8 }}>
          OTP sent to: {maskedMobile}. Expires in ~{Math.floor(expiresIn / 60)} mins.
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {requestId && (
        <div style={{ marginTop: 12 }}>
          <a href={`/register/otp?mobile=${mobile}&requestId=${requestId}`}>Enter OTP</a>
        </div>
      )}
    </div>
  );
}
