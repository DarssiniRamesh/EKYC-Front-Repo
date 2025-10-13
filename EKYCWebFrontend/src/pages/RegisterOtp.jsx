import React, { useMemo, useState } from 'react';

function useQuery() {
  return useMemo(() => new URLSearchParams(window.location.search), []);
}

export default function RegisterOtp() {
  const query = useQuery();
  const mobile = query.get('mobile') || '';
  const requestId = query.get('requestId') || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const verify = async () => {
    setError('');
    setStatus('');
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/mobile/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp, requestId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success || !json.verified) {
        let msg = json.error || 'Verification failed';
        if (res.status === 410) msg = 'OTP expired. Please resend.';
        if (res.status === 423) msg = 'Too many attempts. Try later.';
        setError(msg);
        return;
      }
      setStatus('Verified! Proceed to next step.');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Verify OTP</h2>
      <div>Mobile: {mobile}</div>
      <div style={{ marginTop: 8 }}>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter 6-digit OTP"
        />
        <button onClick={verify} disabled={loading}>
          {loading ? 'Verifying…' : 'Verify'}
        </button>
      </div>
      {status && <div style={{ color: 'green', marginTop: 8 }}>{status}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      <div style={{ marginTop: 12 }}>
        <a href="/register/mobile">Back</a>
      </div>
    </div>
  );
}
