import { request } from '/assets/js/apiClient.js';

export const getNavigation = (params = {}) =>
  request('/navigation', { params });

export const listLocales = () =>
  request('/locales');
