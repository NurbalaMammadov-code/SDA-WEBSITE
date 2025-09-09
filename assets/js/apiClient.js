// /assets/js/apiClient.js
// /assets/js/apiClient.js (senin modern sürümün)
const API_DEBUG = true; // <--- geçici

export async function request(path, { method = 'GET', params, body, headers = {}, timeoutMs = API_CONFIG.TIMEOUT_MS } = {}) {
  let url = resolvePath(path);
  if (API_CONFIG.DEFAULT_LOCALE && (!params || params.locale === undefined)) {
    params = { ...(params || {}), locale: API_CONFIG.DEFAULT_LOCALE };
  }
  url = applyQuery(url, params);

  if (API_DEBUG) console.log('API →', method, url);

  const isFormData = (typeof FormData !== 'undefined') && (body instanceof FormData);
  const isJSON = body && !isFormData;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(isJSON ? { 'Content-Type': 'application/json' } : {}),
        ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
        ...headers,
      },
      body: body ? (isJSON ? JSON.stringify(body) : body) : undefined,
      // credentials: 'include',
      signal: controller.signal,
    });

    if (res.status === 204) return null;
    if (!res.ok) {
      let msg = '';
      try { msg = await res.text(); } catch {}
      throw new Error(`API ${res.status} ${res.statusText} → ${msg}`);
    }

    const contentType = res.headers.get('content-type') || '';
    return contentType.includes('application/json') ? res.json() : res.text();
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Request timeout');
    // CORS/mixed-content’ı tanımak için:
    if (API_DEBUG) console.error('FETCH FAILED:', url, err);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// ── API yapılandırması ──────────────────────────────────────────────────────────
export const API_CONFIG = {
  BASE: 'http://153.92.223.91:8000', // NOT: /docs DEĞİL! (Swagger UI sayfası)
  PREFIX: '/api/v1',                  // aboutApi.js zaten /api/v1/... çağırıyor
  DEFAULT_LOCALE: null,               // örn: 'EN' istersen buraya yaz
  TIMEOUT_MS: 30000,
};

// İsteğe bağlı CDN kökü (resim vb. mutlak yapmak istersen)
const CDN_BASE = null; // örn: 'https://cdn.senin-domainin.com'

// Global auth token (Bearer). setAuthToken ile doldurulur.
let AUTH_TOKEN = null;

// ── Yardımcılar ────────────────────────────────────────────────────────────────
function trimRightSlash(s) { return String(s || '').replace(/\/+$/, ''); }
function trimLeftSlash(s)  { return String(s || '').replace(/^\/+/, ''); }

function joinUrl(base, path) {
  const b = trimRightSlash(base);
  const p = path ? `/${trimLeftSlash(path)}` : '';
  return `${b}${p}`;
}

// /api/v1 prefiksini otomatik eklemeden önce path'i çöz
function resolvePath(path) {
  if (!path) return joinUrl(API_CONFIG.BASE, API_CONFIG.PREFIX);
  // Tam URL gönderildiyse olduğu gibi kullan
  if (/^https?:\/\//i.test(path)) return path;

  // Çağrı zaten /api/... ile başlıyorsa PREFIX ekleme
  if (path.startsWith('/api/')) {
    return joinUrl(API_CONFIG.BASE, path);
  }
  // Göreli bir yol verildiyse PREFIX ile birleştir
  return joinUrl(API_CONFIG.BASE, joinUrl(API_CONFIG.PREFIX, path));
}

// Query paramlarını uygula
function applyQuery(urlString, params) {
  if (!params) return urlString;
  const u = new URL(urlString);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') u.searchParams.set(k, v);
  });
  return u.toString();
}

// Dışarıdan token set/clear
export function setAuthToken(token) { AUTH_TOKEN = token || null; }
export function clearAuthToken() { AUTH_TOKEN = null; }

// Asset URL'lerini mutlaklaştır (CDN varsa onu kullan, yoksa API_BASE)
export function toAbsolute(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const base = CDN_BASE || API_CONFIG.BASE;
  const clean = url.startsWith('/') ? url.slice(1) : url;
  return joinUrl(base, clean);
}

// Ana istek fonksiyonu
export async function request(path, { method = 'GET', params, body, headers = {}, timeoutMs = API_CONFIG.TIMEOUT_MS } = {}) {
  let url = resolvePath(path);

  // Varsayılan locale'i otomatik eklemek istersen:
  if (API_CONFIG.DEFAULT_LOCALE && (!params || params.locale === undefined)) {
    params = { ...(params || {}), locale: API_CONFIG.DEFAULT_LOCALE };
  }

  url = applyQuery(url, params);

  const isFormData = (typeof FormData !== 'undefined') && (body instanceof FormData);
  const isJSON = body && !isFormData;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(isJSON ? { 'Content-Type': 'application/json' } : {}),
        ...(AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {}),
        ...headers,
      },
      body: body ? (isJSON ? JSON.stringify(body) : body) : undefined,
      // Cookie tabanlı auth gerekiyorsa aç:
      // credentials: 'include',
      signal: controller.signal,
    });

    if (res.status === 204) return null;

    if (!res.ok) {
      // Hata içeriğini de alalım ki teşhis kolay olsun
      let msg = '';
      try { msg = await res.text(); } catch {}
      throw new Error(`API ${res.status} ${res.statusText} → ${msg}`);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return res.json();
    }
    return res.text(); // JSON değilse text döndür
  } finally {
    clearTimeout(timer);
  }
}

// URL query okuma
export function getQuery(name, dflt = null) {
  const v = new URLSearchParams(location.search).get(name);
  return v ?? dflt;
}

// Basit tarih formatı (DD.MM.YYYY)
export function formatDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const yy = dt.getFullYear();
  return `${dd}.${mm}.${yy}`;
}
