// /assets/js/projectsApi.js
import { request } from '/assets/js/apiClient.js';

// Liste: ?skip ?limit ?property_sector_id ?q ?sort ...
export const listProjects = (params = {}) =>
  request('/api/v1/projects', { params });

// Detay: hem id hem slug kabul etsin
export const getProject = (slugOrId, params = {}) => {
  const s = String(slugOrId ?? '');
  const isId = /^\d+$/.test(s);
  const path = isId
    ? `/api/v1/projects/id/${encodeURIComponent(s)}`
    : `/api/v1/projects/${encodeURIComponent(s)}`;
  return request(path, { params });
}; 

// Sektör (tek) + Sektör listesi (fallback için)
export const getSector = (id) =>
  request(`/api/v1/property-sectors/${encodeURIComponent(id)}`);

export const listSectors = (params = {}) =>
  request('/api/v1/property-sectors', { params });
