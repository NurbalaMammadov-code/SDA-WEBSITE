// /assets/js/apiClient.js
export const API_BASE = window.location.origin;

export function toAbsolute(url) {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}

export async function request(path, { method='GET', params, body } = {}) {                                                                                     l
  let url = `${API_BASE}${path}`;
  if (params) {
    const u = new URL(url);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, v);
    });
    url = u.toString();
  }
  const isJSON = body && !(body instanceof FormData);
  const res = await fetch(url, {
    method,
    headers: { Accept: 'application/json', ...(isJSON ? { 'Content-Type':'application/json' } : {}) },
    body: body ? (isJSON ? JSON.stringify(body) : body) : undefined,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export function getQuery(name, dflt=null) {
  const v = new URLSearchParams(location.search).get(name);
  return v ?? dflt;
}
export function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2,'0');
  const mm = String(dt.getMonth()+1).padStart(2,'0');
  const yy = dt.getFullYear();
  return `${dd}.${mm}.${yy}`;
}
