import { request, API_CONFIG } from '/assets/js/apiClient.js';

function meta(name, dflt) {
  const el = document.querySelector(`meta[name="${name}"]`);
  return (el && el.content && el.content.trim()) || dflt;
}

 export const NAV_PATH     = meta('api-path-navigation', null);
 export const LOCALES_PATH = meta('api-path-locales', null);

export const getNavigation = (params = {}) => {
 if (!NAV_PATH) return Promise.resolve(null);            // API yoksa çağrı yapma
 const locale = (params.locale ?? API_CONFIG.DEFAULT_LOCALE ?? 'EN').toUpperCase();
 return request(NAV_PATH, { params: { ...params, locale } });
};

export const listLocales = (params = {}) => {
  if (!LOCALES_PATH) return Promise.resolve([]);   
  return request(LOCALES_PATH, { params });
};
