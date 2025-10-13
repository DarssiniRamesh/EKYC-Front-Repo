declare global {
  interface Window {
    __ENV__?: { API_BASE_URL?: string };
  }
}

/**
 * Resolve API base URL in the following precedence:
 * 1. window.__ENV__.API_BASE_URL (injected at runtime by hosting env)
 * 2. process.env.REACT_APP_API_BASE_URL (CRA build-time env)
 * 3. Fallback to http://localhost:3001
 */
export const API_BASE_URL: string =
  (typeof window !== 'undefined' && window.__ENV__?.API_BASE_URL) ||
  (typeof process !== 'undefined' && process.env && (process.env.REACT_APP_API_BASE_URL as string)) ||
  'https://vscode-internal-36366-beta.beta01.cloud.kavia.ai:3001';

// PUBLIC_INTERFACE
export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  /** Wrapper around fetch that prefixes API_BASE_URL and keeps headers. */
  const url = input.startsWith('http') ? input : `${API_BASE_URL}${input}`;
  return window.fetch(url, init);
}

// PUBLIC_INTERFACE
export async function pingHealth(): Promise<{ ok: boolean; status?: number; error?: string }> {
  /** Try GET /health or / and return connectivity status. */
  try {
    const res = await apiFetch('/health', { method: 'GET' });
    if (res.ok) return { ok: true, status: res.status };
    // Some backends may expose health at root "/"
    const res2 = await apiFetch('/', { method: 'GET' });
    return { ok: res2.ok, status: res2.status };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Network error' };
  }
}

// Log effective base URL once at module import (visible in preview console)
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.log('[EKYCWebFrontend] API_BASE_URL =', API_BASE_URL);
}
