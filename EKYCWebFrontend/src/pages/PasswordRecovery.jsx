import React, { useMemo, useState } from 'react';
import '../styles/register.css';

/**
 * PUBLIC_INTERFACE
 * Password recovery request page for email/mobile.
 * - POST /api/auth/password/recovery
 */
export default function PasswordRecovery() {
  const [identifier, setIdentifier] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => identifier.trim().length > 3, [identifier]);

  const requestRecovery = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setErr('');
    try {
      const res = await window.fetch('/api/auth/password/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(json?.error || 'Failed to request recovery');
      }
    } catch (e) {
      setErr('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Recover Password</h1>
      <div>
        <label htmlFor="recovery-identifier">Email or Mobile</label>
        <input
          id="recovery-identifier"
          className="input"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter email or mobile"
          data-test="recovery-identifier-input"
        />
      </div>
      {err ? <div className="error" data-test="recovery-error">{err}</div> : null}
      <div className="actions">
        <button
          className="button"
          type="button"
          onClick={requestRecovery}
          disabled={!canSubmit || loading}
          data-test="send-recovery-btn"
        >
          {loading ? 'Sending…' : 'Send Recovery Link/OTP'}
        </button>
      </div>
    </div>
  );
}
