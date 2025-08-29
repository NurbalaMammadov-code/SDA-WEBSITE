import { request } from '/assets/js/apiClient.js';
export const listProjects = (params={}) => request('/api/v1/projects', { params }); // ?limit ?skip ?year ?tag ?property_sector_id
