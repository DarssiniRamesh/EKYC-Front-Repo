export function navigate(path) {
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', path);
    // simple reload render: trigger a popstate-like event consumers can hook if needed
    window.dispatchEvent(new Event('popstate'));
  }
}

export function getSearchParams() {
  if (typeof window === 'undefined') return new URLSearchParams('');
  return new URLSearchParams(window.location.search || '');
}
