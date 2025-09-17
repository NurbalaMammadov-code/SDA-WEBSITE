import { request, API_CONFIG } from '/assets/js/apiClient.js';

function meta(name, dflt) {
  const el = document.querySelector(`meta[name="${name}"]`);
  return (el && el.content && el.content.trim()) || dflt;
}

const NAV_PATH    = meta('api-path-navigation', '/api/v1/navigation');
const LOCALES_PATH= meta('api-path-locales', '/api/v1/locales');

export const getNavigation = (params = {}) => {
  const locale = (params.locale ?? API_CONFIG.DEFAULT_LOCALE ?? 'EN').toUpperCase();
  return request(NAV_PATH, { params: { ...params, locale } });
};

export const listLocales = () => request(LOCALES_PATH);
