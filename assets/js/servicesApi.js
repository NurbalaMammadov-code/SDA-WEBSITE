// /assets/js/servicesApi.js
import { request } from '/assets/js/apiClient.js';

// Liste: ?skip ?limit ?order_by ?direction
export const listServices = (params = {}) =>
  request('/api/v1/services', { params });

// Detay: id veya slug kabul eder
export const getService = (idOrSlug, params = {}) =>
  request(`/api/v1/services/${encodeURIComponent(idOrSlug)}`, { params });

// What we do (features) liste: ?service_id ?skip ?limit ?order_by ?direction
export const listServiceFeatures = (params = {}) =>
  request('/api/v1/service-features', { params });

// Benefits liste: ?service_id ?skip ?limit ?order_by ?direction
export const listServiceBenefits = (params = {}) =>
  request('/api/v1/service-benefits', { params });

// Featured projects için: ?service_id ?limit ?order_by ?direction
export const listProjects = (params = {}) =>
  request('/api/v1/projects', { params });
