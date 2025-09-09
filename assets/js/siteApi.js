import { request } from '/assets/js/apiClient.js';

export const getNavigation = (params = {}) =>
  request('/api/v1/navigation', { params });

export const listLocales = () =>
  request('/api/v1/locales');
