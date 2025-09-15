
export const API_CONFIG = {
  BASE: 'https://sdaconsulting.az', 
  PREFIX: '/api/v1',                  
  DEFAULT_LOCALE: null,              
  TIMEOUT_MS: 10000,
}; 


const CDN_BASE = null;


let AUTH_TOKEN = undefined;


function trimRightSlash(s) { return String(s || '').replace(/\/+$/, ''); }
function trimLeftSlash(s)  { return String(s || '').replace(/^\/+/, ''); }

function joinUrl(base, path) {
  const b = trimRightSlash(base);
  const p = path ? `/${trimLeftSlash(path)}` : '';
  return `${b}${p}`;
}


function resolvePath(path) {
  if (!path) return joinUrl(API_CONFIG.BASE, API_CONFIG.PREFIX);
 
  if (/^https?:\/\//i.test(path)) return path;

  
  if (path.startsWith('/api/')) {
    return joinUrl(API_CONFIG.BASE, path);
  }
  
  return joinUrl(API_CONFIG.BASE, joinUrl(API_CONFIG.PREFIX, path));
}


function applyQuery(uString, params) {
  const u = new URL(uString, API_CONFIG.BASE);  // BASE kesin kullanılsın

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) u.searchParams.set(k, v);
    });
  }
  return u.toString();
}




export function setAuthToken(token) { AUTH_TOKEN = token || null; }
export function clearAuthToken() { AUTH_TOKEN = null; }


export function toAbsolute(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const base = CDN_BASE || API_CONFIG.BASE;
  const clean = url.startsWith('/') ? url.slice(1) : url;
  return joinUrl(base, clean);
}


export async function request(path, { method = 'GET', params, body, headers = {}, timeoutMs = API_CONFIG.TIMEOUT_MS } = {}) {
  let url = resolvePath(path);

 
  if (API_CONFIG.DEFAULT_LOCALE && (!params || params.locale === undefined)) {
    params = { ...(params || {}), locale: API_CONFIG.DEFAULT_LOCALE };
  }

  url = applyQuery(url, params);

  const isFormData = (typeof FormData !== 'undefined') && (body instanceof FormData);
  const isJSON = body && !isFormData;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

try {
  // GET/HEAD istekleri için body ve Content-Type göndermemek için kontrol
  const isGetLike = method === 'GET' || method === 'HEAD';

  const res = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...(!isGetLike && isJSON ? { 'Content-Type': 'application/json' } : {}),
      ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
      ...headers,
    },
    body: !isGetLike && body ? (isJSON ? JSON.stringify(body) : body) : undefined,
    signal: controller.signal,
  });
}
 finally {
    clearTimeout(timer);
  }
}

// URL query okuma
export function getQuery(name, dflt = null) {
  const v = new URLSearchParams(location.search).get(name);
  return v ?? dflt;
}


export function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yy = dt.getFullYear();
  return `${dd}.${mm}.${yy}`;
}


