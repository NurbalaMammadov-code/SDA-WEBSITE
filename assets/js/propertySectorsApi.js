// /assets/js/propertySectorsApi.js
import { request } from '/assets/js/apiClient.js';

// Sektörler (filtre butonları için)
export const listPropertySectors = (params = {}) =>
  request('/api/v1/property-sectors', { params });
